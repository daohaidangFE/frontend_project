import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import jobService from "services/jobService";
import { useTranslation } from "react-i18next";

export default function CreateJob() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const history = useHistory();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    position: "",
    location: "",
    workMode: "ONSITE",
    description: "",
    duration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user || !user.userId) {
        alert("Vui lòng đăng nhập lại!");
        return;
      }

      // Gọi API
      await jobService.createJob(user.userId, formData);
      
      alert(t('create_job_success')); 
      // Redirect về trang quản lý tin (tạm thời về chính nó nếu chưa có trang quản lý)
      // history.push("/employer/jobs"); 
      
      // Reset form để đăng tin tiếp
      setFormData({
        title: "", position: "", location: "", workMode: "ONSITE", description: "", duration: ""
      });

    } catch (error) {
      console.error("Lỗi đăng tin:", error);
      alert(t('create_job_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6 border-b border-blueGray-200">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">
            {t('create_job_title')}
          </h6>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit} className="mt-6">
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t('job_info_section')}
          </h6>
          
          <div className="flex flex-wrap">
            {/* Title */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('job_title_label')}
                </label>
                <input
                  type="text"
                  name="title"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder={t('job_title_placeholder')}
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
                  {t('job_position_label')}
                </label>
                <input
                  type="text"
                  name="position"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder={t('job_position_placeholder')}
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
                  {t('job_location_label')}
                </label>
                <input
                  type="text"
                  name="location"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder={t('job_location_placeholder')}
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
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder={t('duration_placeholder')}
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t('job_description_section')}
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('description_label')}
                </label>
                <textarea
                  name="description"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  rows="6"
                  placeholder={t('description_placeholder')}
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="bg-brand text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="submit"
              disabled={loading}
            >
              {loading ? t('processing') : t('post_job_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}