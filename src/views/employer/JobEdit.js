import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import jobService from "services/jobService";
import skillService from "services/skillService";

export default function JobEdit() {
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    position: "",
    description: "",
    duration: "",
    location: "",
    workMode: "ONSITE",
    skills: [] // Array of { skillId, skillName, importanceLevel, note }
  });

  // Skill Search State
  const [skillSearchTerm, setSkillSearchTerm] = useState("");
  const [skillResults, setSkillResults] = useState([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);

  // ================== 1. LOAD DATA ==================
  useEffect(() => {
    async function fetchJob() {
      try {
        const data = await jobService.getEmployerJobDetail(id);

        if (data.status === 'EXPIRED') {
          toast.error("Bài đăng đã hết hạn, không thể chỉnh sửa!");
          history.push("/employer/jobs");
          return;
        }

        // --- XỬ LÝ KỸ NĂNG (FALLBACK TÊN) ---
        let currentSkills = data.skills || [];
        const missingNameSkills = currentSkills.filter(s => !s.skillName && !s.name);
        
        if (missingNameSkills.length > 0) {
            try {
                const skillIds = currentSkills.map(s => s.skillId);
                const skillInfos = await skillService.getSkillsBatch(skillIds);
                currentSkills = currentSkills.map(s => {
                    const found = skillInfos.find(info => info.id === s.skillId);
                    return found ? { ...s, skillName: found.name } : s;
                });
            } catch (err) {
                console.warn("Lỗi fetch tên skill bổ sung:", err);
            }
        }

        setFormData({
          title: data.title || "",
          position: data.position || "",
          description: data.description || "",
          duration: data.duration || "",
          location: data.location || "",
          workMode: data.workMode || "ONSITE",
          skills: currentSkills.map(s => ({
             skillId: s.skillId,
             skillName: s.skillName || s.name, // Ưu tiên tên hiển thị
             importanceLevel: s.importanceLevel || "MEDIUM", // Mặc định MEDIUM
             note: s.note || ""
          }))
        });

      } catch (error) {
        console.error(error);
        toast.error("Lỗi tải thông tin bài đăng");
        history.push("/employer/jobs");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id, history]);

  // ================== 2. HANDLERS ==================

  // Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- SKILL HANDLERS ---
  
  // Tìm kiếm skill (Debounce)
  const handleSearchSkill = (e) => {
    const keyword = e.target.value;
    setSkillSearchTerm(keyword);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!keyword.trim()) {
        setSkillResults([]);
        setShowSkillDropdown(false);
        return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
        try {
            const results = await skillService.searchSkills(keyword);
            setSkillResults(results || []);
            setShowSkillDropdown(true);
        } catch (error) {
            console.error(error);
        }
    }, 500); // Đợi 500ms sau khi ngừng gõ mới tìm
  };

  // Chọn skill từ dropdown
  const handleAddSkill = (skill) => {
    // Check trùng
    if (formData.skills.some(s => s.skillId === skill.id)) {
        toast.info("Kỹ năng này đã được chọn!");
        setSkillSearchTerm("");
        setShowSkillDropdown(false);
        return;
    }

    const newSkill = {
        skillId: skill.id,
        skillName: skill.name,
        importanceLevel: "MEDIUM", // Mặc định
        note: ""
    };

    setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
    }));
    
    setSkillSearchTerm("");
    setShowSkillDropdown(false);
  };

  // Xóa skill
  const handleRemoveSkill = (skillId) => {
      setFormData(prev => ({
          ...prev,
          skills: prev.skills.filter(s => s.skillId !== skillId)
      }));
  };

  // Đổi mức độ quan trọng
  const handleChangeSkillLevel = (skillId, level) => {
      setFormData(prev => ({
          ...prev,
          skills: prev.skills.map(s => s.skillId === skillId ? { ...s, importanceLevel: level } : s)
      }));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
        const payload = {
            title: formData.title,
            position: formData.position,
            description: formData.description,
            duration: formData.duration,
            location: formData.location,
            workMode: formData.workMode,
            // Format đúng yêu cầu backend
            skills: formData.skills.map(s => ({
                skillId: s.skillId,
                importanceLevel: s.importanceLevel,
                note: s.note
            }))
        };

        await jobService.updateJob(id, payload);
        toast.success("Cập nhật thành công!");
        history.push(`/employer/jobs/${id}`);
    } catch (error) {
        console.error(error);
        toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return (
      <div className="flex justify-center items-center h-64">
          <i className="fas fa-spinner fa-spin text-3xl text-blueGray-400"></i>
      </div>
  );

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      
      {/* HEADER */}
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Chỉnh sửa bài đăng</h6>
          <Link
             to={`/employer/jobs/${id}`}
             className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          >
             Hủy bỏ
          </Link>
        </div>
      </div>

      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          
          {/* --- THÔNG TIN CƠ BẢN --- */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Thông tin cơ bản
          </h6>
          
          <div className="flex flex-wrap">
            {/* Title */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Tiêu đề tin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Position */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Vị trí tuyển dụng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Địa điểm làm việc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Work Mode */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Hình thức làm việc
                </label>
                <select
                  name="workMode"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={formData.workMode}
                  onChange={handleChange}
                >
                    <option value="ONSITE">Tại văn phòng (Onsite)</option>
                    <option value="REMOTE">Làm từ xa (Remote)</option>
                    <option value="HYBRID">Linh hoạt (Hybrid)</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Thời gian thực tập
                </label>
                <input
                  type="text"
                  name="duration"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="VD: 3 tháng, Full-time..."
                />
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* --- YÊU CẦU KỸ NĂNG --- */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Yêu cầu kỹ năng
          </h6>
          <div className="px-4 mb-6">
              {/* Ô tìm kiếm */}
              <div className="relative w-full mb-4">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Thêm kỹ năng mới
                  </label>
                  <input
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Nhập tên kỹ năng để tìm kiếm (VD: Java, React...)"
                    value={skillSearchTerm}
                    onChange={handleSearchSkill}
                  />
                  
                  {/* Dropdown kết quả */}
                  {showSkillDropdown && skillResults.length > 0 && (
                      <ul className="absolute z-50 w-full bg-white border border-blueGray-200 shadow-lg max-h-48 overflow-y-auto rounded-b mt-1">
                          {skillResults.map(skill => (
                              <li 
                                key={skill.id}
                                onClick={() => handleAddSkill(skill)}
                                className="px-4 py-2 hover:bg-lightBlue-50 cursor-pointer text-sm text-blueGray-700 border-b border-blueGray-100 last:border-0"
                              >
                                  {skill.name}
                              </li>
                          ))}
                      </ul>
                  )}
              </div>

              {/* Danh sách kỹ năng đã chọn */}
              <div className="bg-white rounded shadow p-4 min-h-[100px]">
                  {formData.skills.length === 0 && (
                      <p className="text-blueGray-400 text-sm italic text-center py-4">Chưa có kỹ năng nào được chọn.</p>
                  )}
                  
                  {formData.skills.map((item, index) => (
                      <div key={item.skillId || index} className="flex flex-wrap items-center justify-between border-b border-blueGray-100 py-3 last:border-0">
                          <div className="flex-1">
                              <span className="font-bold text-blueGray-700">{item.skillName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                              {/* Chọn Level */}
                              <select
                                  className="text-xs border border-blueGray-200 rounded px-2 py-1 text-blueGray-600 focus:outline-none"
                                  value={item.importanceLevel}
                                  onChange={(e) => handleChangeSkillLevel(item.skillId, e.target.value)}
                              >
                                  <option value="HIGH">Bắt buộc (High)</option>
                                  <option value="MEDIUM">Cần thiết (Medium)</option>
                                  <option value="LOW">Tham khảo (Low)</option>
                              </select>

                              {/* Nút Xóa */}
                              <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(item.skillId)}
                                  className="text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition"
                                  title="Xóa kỹ năng này"
                              >
                                  <i className="fas fa-trash"></i>
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* --- NỘI DUNG CHI TIẾT --- */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            Nội dung chi tiết
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  Mô tả công việc <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  rows="10"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center mt-6 gap-4">
             <Link
                to={`/employer/jobs/${id}`}
                className="bg-blueGray-200 text-blueGray-600 active:bg-blueGray-300 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
             >
                Hủy
             </Link>
             <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center"
             >
                {submitting && <i className="fas fa-spinner fa-spin mr-2"></i>}
                {submitting ? "Đang lưu..." : "Lưu thay đổi"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}