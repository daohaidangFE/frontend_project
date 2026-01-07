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

  // State Search Skill
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
          const results = data.content || data || []; 
          if (results.length > 0) {
            setSkillSuggestions(results);
            setShowSuggestions(true);
          } else {
            setSkillSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (err) {
          // Silent fail
        }
      } else {
        setSkillSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [skillInput]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // ===== HANDLERS =====
  const handleSelectSkill = (skill) => {
    const exists = formData.skills.find(s => s.skillId === skill.id);
    if (exists) {
      toast.info(t("skill_exists"));
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
        toast.warning(t("login_required"));
        setLoading(false);
        return;
      }

      if (formData.skills.length === 0) {
        toast.warning(t("skills_required"));
        setLoading(false);
        return;
      }

      await jobService.createJob(formData);
      toast.success(t("create_job_success"));
      history.push("/employer/dashboard");

    } catch (error) {
      toast.error(error.response?.data?.message || t("create_job_error"));
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
            {t("create_job_title")}
          </h6>
        </div>
      </div>

      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit} className="mt-6">

          {/* 1. BASIC INFO */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">{t("job_info_section")}</h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 mb-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t("job_title_label")}</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder={t("job_title_placeholder")} required className={inputClass} />
            </div>
            <div className="w-full lg:w-6/12 px-4 mb-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t("job_position_label")}</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder={t("job_position_placeholder")} required className={inputClass} />
            </div>
            <div className="w-full lg:w-6/12 px-4 mb-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t("job_location_label")}</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder={t("job_location_placeholder")} required className={inputClass} />
            </div>
            <div className="w-full lg:w-6/12 px-4 mb-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t("work_mode_label")}</label>
              <select name="workMode" value={formData.workMode} onChange={handleChange} className={inputClass}>
                <option value="ONSITE">{t("work_mode_onsite")}</option>
                <option value="REMOTE">{t("work_mode_remote")}</option>
                <option value="HYBRID">{t("work_mode_hybrid")}</option>
              </select>
            </div>
            <div className="w-full lg:w-12/12 px-4 mb-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t("duration_label")}</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder={t("duration_placeholder")} className={inputClass} />
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* 2. SKILLS */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t("skills_section")} <span className="text-red-500">*</span>
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
                        placeholder={t("search_skill_placeholder")}
                        className={inputClass}
                        autoComplete="off" 
                      />
                      
                      {/* SUGGESTIONS DROPDOWN */}
                      {showSuggestions && skillSuggestions.length > 0 && (
                        <ul className="absolute left-0 right-0 bg-white border border-blueGray-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto" style={{ zIndex: 9999 }}>
                            {skillSuggestions.map(skill => (
                                <li 
                                    key={skill.id}
                                    onMouseDown={() => handleSelectSkill(skill)}
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
                          <option value="HIGH">{t("importance_high")}</option>
                          <option value="MEDIUM">{t("importance_medium")}</option>
                          <option value="LOW">{t("importance_low")}</option>
                      </select>
                  </div>
               </div>
            </div>

            <div className="w-full mt-4">
                {formData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                            <div key={skill.skillId} className="flex items-center bg-lightBlue-100 text-lightBlue-700 px-3 py-1 rounded-full text-sm font-semibold border border-lightBlue-200">
                                <span>
                                    {skill.skillName} ({skill.importanceLevel === "HIGH" ? t("importance_high") : skill.importanceLevel === "MEDIUM" ? t("importance_medium") : t("importance_low")})
                                </span>
                                <button type="button" onClick={() => handleRemoveSkill(skill.skillId)} className="text-red-400 ml-2"><i className="fas fa-times"></i></button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-blueGray-400 p-2 border border-dashed border-blueGray-300 rounded text-center">{t("no_skills_selected")}</div>
                )}
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* 3. DESCRIPTION */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">{t("job_description_section")}</h6>
          <div className="w-full px-4 mb-4">
            <textarea name="description" rows="6" value={formData.description} onChange={handleChange} placeholder={t("description_placeholder")} className={inputClass} />
          </div>

          <div className="flex justify-center mt-6">
            <button type="submit" disabled={loading} className="bg-emerald-500 text-white font-bold uppercase text-sm px-8 py-3 rounded-full shadow hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? t("processing") : t("post_job_button")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}