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
          toast.error(t('job_expired_edit_error'));
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
                // Silent fail
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
        toast.error(t('load_job_error'));
        history.push("/employer/jobs");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id, history, t]);

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
            // Error handling
        }
    }, 500); 
  };

  // Chọn skill từ dropdown
  const handleAddSkill = (skill) => {
    // Check trùng
    if (formData.skills.some(s => s.skillId === skill.id)) {
        toast.info(t('skill_exists'));
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
        toast.success(t('update_success'));
        history.push(`/employer/jobs/${id}`);
    } catch (error) {
        toast.error(t('update_error'));
    } finally {
        setSubmitting(false);
    }
  };

  const inputClass = `w-full px-3 py-3 text-sm rounded-lg bg-white text-blueGray-700 border border-blueGray-200 hover:border-blueGray-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition`;

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
          <h6 className="text-blueGray-700 text-xl font-bold">{t('edit_job_title')}</h6>
          <Link
             to={`/employer/jobs/${id}`}
             className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          >
             {t('cancel')}
          </Link>
        </div>
      </div>

      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          
          {/* --- 1. BASIC INFO --- */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t('job_info_section')}
          </h6>
          
          <div className="flex flex-wrap">
            {/* Title */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('job_title_label')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className={inputClass}
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
                  {t('job_position_label')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  className={inputClass}
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
                  {t('job_location_label')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className={inputClass}
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
                  {t('work_mode_label')}
                </label>
                <select
                  name="workMode"
                  className={inputClass}
                  value={formData.workMode}
                  onChange={handleChange}
                >
                    <option value="ONSITE">{t('work_mode_onsite')}</option>
                    <option value="REMOTE">{t('work_mode_remote')}</option>
                    <option value="HYBRID">{t('work_mode_hybrid')}</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('duration_label')}
                </label>
                <input
                  type="text"
                  name="duration"
                  className={inputClass}
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder={t('duration_placeholder')}
                />
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* --- 2. SKILLS --- */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t('skills_section')}
          </h6>
          <div className="px-4 mb-6">
              {/* Search Box */}
              <div className="relative w-full mb-4">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    {t('add_new_skill')}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={t('search_skill_placeholder')}
                    value={skillSearchTerm}
                    onChange={handleSearchSkill}
                  />
                  
                  {/* Dropdown */}
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

              {/* Selected Skills List */}
              <div className="bg-white rounded shadow p-4 min-h-[100px]">
                  {formData.skills.length === 0 && (
                      <p className="text-blueGray-400 text-sm italic text-center py-4">{t('no_skills_selected')}</p>
                  )}
                  
                  {formData.skills.map((item, index) => (
                      <div key={item.skillId || index} className="flex flex-wrap items-center justify-between border-b border-blueGray-100 py-3 last:border-0">
                          <div className="flex-1">
                              <span className="font-bold text-blueGray-700">{item.skillName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                              {/* Level Select */}
                              <select
                                  className="text-xs border border-blueGray-200 rounded px-2 py-1 text-blueGray-600 focus:outline-none"
                                  value={item.importanceLevel}
                                  onChange={(e) => handleChangeSkillLevel(item.skillId, e.target.value)}
                              >
                                  <option value="HIGH">{t('importance_high')}</option>
                                  <option value="MEDIUM">{t('importance_medium')}</option>
                                  <option value="LOW">{t('importance_low')}</option>
                              </select>

                              {/* Remove Button */}
                              <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(item.skillId)}
                                  className="text-red-500 hover:text-red-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition"
                                  title={t('delete_skill_tooltip')}
                              >
                                  <i className="fas fa-trash"></i>
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* --- 3. DESCRIPTION --- */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t('job_description_section')}
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('description_label')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  className={inputClass}
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
                {t('cancel')}
             </Link>
             <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center"
             >
                {submitting && <i className="fas fa-spinner fa-spin mr-2"></i>}
                {submitting ? t('saving') : t('save_changes')}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}