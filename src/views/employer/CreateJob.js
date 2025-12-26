import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import jobService from "services/jobService";
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

  // ===== HANDLE CHANGE =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        toast.warning(t("login_required", "Vui lòng đăng nhập để thực hiện chức năng này!"));
        return;
      }

      await jobService.createJob(formData);

      toast.success(
        t("create_job_success", "Đăng tin thành công! Vui lòng chờ Admin duyệt.")
      );

      setFormData({
        title: "",
        position: "",
        location: "",
        workMode: "ONSITE",
        description: "",
        duration: "",
        skills: []
      });

    } catch (error) {
      console.error("Lỗi đăng tin:", error);
      toast.error(
        error.response?.data?.message ||
        t("create_job_error", "Có lỗi xảy ra khi đăng tin.")
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== COMMON INPUT STYLE (CHỈ ĐỔI VIỀN + FOCUS) =====
  const inputClass = `
    w-full px-3 py-3 text-sm rounded-lg
    bg-white text-blueGray-700
    border border-blueGray-200
    hover:border-blueGray-300
    focus:outline-none
    focus:border-emerald-400
    focus:ring-2 focus:ring-emerald-100
    transition
  `;

  return (
    <div className="relative flex flex-col w-full shadow-lg rounded-xl bg-white border border-blueGray-100">
      
      {/* ===== HEADER ===== */}
      <div className="rounded-t bg-white mb-0 px-6 py-6 border-b border-blueGray-200">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">
            {t("create_job_title", "Tạo bài đăng thực tập mới")}
          </h6>
        </div>
      </div>

      {/* ===== FORM ===== */}
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit} className="mt-6">

          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t("job_info_section", "Thông tin cơ bản")}
          </h6>

          <div className="flex flex-wrap">
            {/* Title */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t("job_title_label", "Tiêu đề bài đăng")}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t("job_title_placeholder", "VD: Thực tập sinh Java Backend")}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Position */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t("job_position_label", "Vị trí thực tập")}
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder={t("job_position_placeholder", "VD: Backend Developer")}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Location */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t("job_location_label", "Địa điểm làm việc")}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={t("job_location_placeholder", "VD: Cầu Giấy, Hà Nội")}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Work Mode */}
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t("work_mode_label", "Hình thức làm việc")}
                </label>
                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="ONSITE">{t("work_mode_onsite", "Làm tại văn phòng (On-site)")}</option>
                  <option value="REMOTE">{t("work_mode_remote", "Làm từ xa (Remote)")}</option>
                  <option value="HYBRID">{t("work_mode_hybrid", "Linh hoạt (Hybrid)")}</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t("duration_label", "Thời gian thực tập")}
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder={t("duration_placeholder", "VD: 3 tháng, 6 tháng...")}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />

          {/* ===== DESCRIPTION ===== */}
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            {t("job_description_section", "Mô tả chi tiết")}
          </h6>

          <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
              <div className="relative w-full mb-4">
                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                  {t("description_label", "Yêu cầu & Mô tả công việc")}
                </label>
                <textarea
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t(
                    "description_placeholder",
                    "Nhập mô tả chi tiết công việc, quyền lợi..."
                  )}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* ===== SUBMIT ===== */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-8 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none transition-all"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              {loading
                ? t("processing", "Đang xử lý...")
                : t("post_job_button", "Đăng bài tuyển dụng")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
