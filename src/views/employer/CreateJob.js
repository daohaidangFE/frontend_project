import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import jobService from "services/jobService";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';

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
    skills: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        toast.warning("Vui lòng đăng nhập để thực hiện chức năng này!");
        return;
      }

      await jobService.createJob(formData); 
      
      toast.success(t('create_job_success', 'Đăng tin thành công! Vui lòng chờ Admin duyệt.'));
      
      setFormData({
        title: "", position: "", location: "", workMode: "ONSITE", description: "", duration: "", skills: []
      });


    } catch (error) {
      console.error("Lỗi đăng tin:", error);
      const backendMsg = error.response?.data?.message;
      toast.error(backendMsg || t('create_job_error', 'Có lỗi xảy ra khi đăng tin.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6 border-b border-blueGray-200">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">
            {t('create_job_title', 'Tạo bài đăng thực tập mới')}
          </h6>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit} className="mt-6">
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t('job_info_section', 'Thông tin cơ bản')}
          </h6>
          
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('job_title_label', 'Tiêu đề bài đăng')}
                </label>
                <input
                  type="text"
                  name="title"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder={t('job_title_placeholder', 'VD: Thực tập sinh Java Backend')}
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('job_position_label', 'Vị trí thực tập')}
                </label>
                <input
                  type="text"
                  name="position"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder={t('job_position_placeholder', 'VD: Backend Developer')}
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('job_location_label', 'Địa điểm làm việc')}
                </label>
                <input
                  type="text"
                  name="location"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder={t('job_location_placeholder', 'VD: Cầu Giấy, Hà Nội')}
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('work_mode_label', 'Hình thức làm việc')}
                </label>
                <select
                  name="workMode"
                  className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  value={formData.workMode}
                  onChange={handleChange}
                >
                  <option value="ONSITE">Làm tại văn phòng (On-site)</option>
                  <option value="REMOTE">Làm từ xa (Remote)</option>
                  <option value="HYBRID">Linh hoạt (Hybrid)</option>
                </select>
              </div>
            </div>

            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('duration_label', 'Thời gian thực tập')}
                </label>
                <input
                  type="text"
                  name="duration"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder={t('duration_placeholder', 'VD: 3 tháng, 6 tháng...')}
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t('job_description_section', 'Mô tả chi tiết')}
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-3">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t('description_label', 'Yêu cầu & Mô tả công việc')}
                </label>
                <textarea
                  name="description"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  rows="6"
                  placeholder={t('description_placeholder', 'Nhập mô tả chi tiết công việc, quyền lợi...')}
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-8 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="submit"
              disabled={loading}
            >
              <i className="fas fa-paper-plane mr-2"></i>
              {loading ? t('processing', 'Đang xử lý...') : t('post_job_button', 'Đăng bài tuyển dụng')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}