import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import jobService from "services/jobService";
import skillService from "services/skillService";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function CreateJob() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const history = useHistory();

  // ===== STATE =====
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    position: "",
    location: "",
    workMode: "ONSITE",
    description: "",
    duration: "",
    skills: []
  });

  // State tìm kiếm skill
  const [skillInput, setSkillInput] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentImportance, setCurrentImportance] = useState("MEDIUM");
  const wrapperRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ===== SEARCH SKILL (DEBOUNCE) =====
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (skillInput.trim().length > 1) {
        try {
          const data = await skillService.searchSkills(skillInput);
          // Backend trả Page hoặc List, check kỹ
          const results = data.content || data || []; 
          if (results.length > 0) {
            setSkillSuggestions(results);
            setShowSuggestions(true);
          } else {
            setSkillSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (err) {
          console.error("Lỗi tìm skill:", err);
        }
      } else {
        setSkillSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [skillInput]);

  // Click outside đóng dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // ===== CHỌN SKILL =====
  const handleSelectSkill = (skill) => {
    const exists = formData.skills.find(s => s.skillId === skill.id);
    if (exists) {
      toast.info(t("skill_exists", "Kỹ năng này đã được chọn!"));
      setSkillInput("");
      setShowSuggestions(false);
      return;
    }

    const newSkill = {
      skillId: skill.id,
      skillName: skill.name,
      importanceLevel: currentImportance,
      note: ""
    };

    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));

    setSkillInput("");
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.skillId !== skillId)
    }));
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        toast.warning(t("login_required", "Vui lòng đăng nhập!"));
        setLoading(false);
        return;
      }

      if (formData.skills.length === 0) {
        toast.warning(t("skills_required", "Vui lòng chọn ít nhất 1 kỹ năng!"));
        setLoading(false);
        return;
      }

      await jobService.createJob(formData);
      toast.success(t("create_job_success", "Đăng tin thành công!"));
      history.push("/employer/dashboard");

    } catch (error) {
      console.error("Lỗi đăng tin:", error);
      toast.error(error.response?.data?.message || t("create_job_error", "Có lỗi xảy ra."));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-3 py-3 text-sm rounded-lg bg-white text-blueGray-700 border border-blueGray-200 hover:border-blueGray-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition`;

  return (
    <div className="relative flex flex-col w-full shadow-lg rounded-xl bg-white border border-blueGray-100">
      <div className="rounded-t bg-white mb-0 px-6 py-6 border-b border-blueGray-200">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">
            {t("create_job_title", "Tạo bài đăng thực tập mới")}
          </h6>
        </div>
      </div>

      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit} className="mt-6">

          {/* 1. THÔNG TIN CƠ BẢN */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">{t("job_info_section", "Thông tin cơ bản")}</h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 mb-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t("job_title_label", "Tiêu đề bài đăng")}</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="VD: Thực tập sinh Java" required className={inputClass} />
            </div>
            <div className="w-full lg:w-6/12 px-4 mb-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t("job_position_label", "Vị trí")}</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="VD: Backend Dev" required className={inputClass} />
            </div>
            <div className="w-full lg:w-6/12 px-4 mb-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t("job_location_label", "Địa điểm")}</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="VD: Hà Nội" required className={inputClass} />
            </div>
            <div className="w-full lg:w-6/12 px-4 mb-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t("work_mode_label", "Hình thức")}</label>
              <select name="workMode" value={formData.workMode} onChange={handleChange} className={inputClass}>
                <option value="ONSITE">On-site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div className="w-full lg:w-12/12 px-4 mb-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t("duration_label", "Thời gian")}</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="VD: 3 tháng" className={inputClass} />
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* 2. KỸ NĂNG (Đã sửa Dropdown) */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t("skills_section", "Kỹ năng yêu cầu")} <span className="text-red-500">*</span>
          </h6>

          <div className="flex flex-wrap px-4 mb-4" ref={wrapperRef}>
            <div className="w-full relative">
               <div className="flex gap-2">
                  <div className="flex-grow relative">
                      <input 
                        type="text" 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onFocus={() => { if(skillSuggestions.length > 0) setShowSuggestions(true); }}
                        placeholder="Tìm kiếm kỹ năng (VD: Java...)"
                        className={inputClass}
                        autoComplete="off" 
                      />
                      
                      {/* DROPDOWN GỢI Ý - Fix zIndex */}
                      {showSuggestions && skillSuggestions.length > 0 && (
                        <ul className="absolute left-0 right-0 bg-white border border-blueGray-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto" style={{ zIndex: 9999 }}>
                            {skillSuggestions.map(skill => (
                                <li 
                                    key={skill.id}
                                    onMouseDown={() => handleSelectSkill(skill)} // Dùng onMouseDown
                                    className="px-4 py-2 hover:bg-emerald-100 cursor-pointer text-blueGray-700 text-sm border-b border-blueGray-100 last:border-0"
                                >
                                    {skill.name}
                                </li>
                            ))}
                        </ul>
                      )}
                  </div>

                  <div className="w-1/4">
                      <select value={currentImportance} onChange={(e) => setCurrentImportance(e.target.value)} className={inputClass}>
                          <option value="HIGH">Cao</option>
                          <option value="MEDIUM">Trung bình</option>
                          <option value="LOW">Thấp</option>
                      </select>
                  </div>
               </div>
            </div>

            <div className="w-full mt-4">
                {formData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                            <div key={skill.skillId} className="flex items-center bg-lightBlue-100 text-lightBlue-700 px-3 py-1 rounded-full text-sm font-semibold border border-lightBlue-200">
                                <span>{skill.skillName} ({skill.importanceLevel})</span>
                                <button type="button" onClick={() => handleRemoveSkill(skill.skillId)} className="text-red-400 ml-2"><i className="fas fa-times"></i></button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-blueGray-400 p-2 border border-dashed border-blueGray-300 rounded text-center">Chưa chọn kỹ năng nào.</div>
                )}
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* 3. MÔ TẢ */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">{t("job_description_section", "Mô tả chi tiết")}</h6>
          <div className="w-full px-4 mb-4">
            <textarea name="description" rows="6" value={formData.description} onChange={handleChange} placeholder={t("description_placeholder", "Mô tả công việc...")} className={inputClass} />
          </div>

          <div className="flex justify-center mt-6">
            <button type="submit" disabled={loading} className="bg-emerald-500 text-white font-bold uppercase text-sm px-8 py-3 rounded-full shadow hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? t("processing", "Đang xử lý...") : t("post_job_button", "Đăng bài")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}