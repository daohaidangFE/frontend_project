import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import cvService from "services/cvService";
import { Link } from "react-router-dom";

export default function CVCard({ profile, onUploadSuccess, onPreview }) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const hasCV = !!profile.cvUrl;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate client-side
    if (file.type !== "application/pdf") {
      toast.warning(t("cv_invalid_format"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warning(t("cv_file_too_large"));
      return;
    }

    setUploading(true);
    try {
      await cvService.uploadCV(file);
      toast.success(t("cv_upload_success"));
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error(t("cv_upload_failed"));
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blueGray-200 p-5">
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-lg font-bold text-blueGray-700">{t("cv_title")}</h5>
        {uploading && <i className="fas fa-spinner fa-spin text-lightBlue-500"></i>}
      </div>
      
      {hasCV ? (
        <div className="mb-4">
            <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 px-4 py-3 rounded text-sm mb-3 flex items-center">
                <i className="fas fa-check-circle mr-2 text-lg"></i> 
                <span className="font-semibold">{t("cv_default_status", "CV mặc định đã sẵn sàng")}</span>
            </div>
            
            {/* Nhóm các nút hành động */}
            <div className="flex flex-col gap-2">
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        onPreview(); // Gọi hàm preview truyền từ cha
                    }}
                    className="block w-full text-center bg-blueGray-700 hover:bg-blueGray-800 text-white font-bold py-2 px-4 rounded transition-colors duration-150 text-sm shadow hover:shadow-lg"
                >
                    <i className="fas fa-eye mr-2"></i> {t("cv_view_default", "Xem CV mặc định")}
                </button>

                {/* NÚT MỚI: Dẫn đến trang quản lý */}
                <Link 
                    to="/student/cv-management" 
                    className="block w-full text-center bg-white border border-blueGray-700 text-blueGray-700 hover:bg-blueGray-100 font-bold py-2 px-4 rounded transition-colors duration-150 text-sm shadow"
                >
                    <i className="fas fa-tasks mr-2"></i> {t("manage_all_cvs", "Quản lý danh sách CV")}
                </Link>
            </div>
        </div>
      ) : (
        <div className="bg-orange-100 border border-orange-200 text-orange-700 px-4 py-3 rounded text-sm mb-4 flex items-center">
            <i className="fas fa-exclamation-triangle mr-2 text-lg"></i> 
            <span>{t("cv_missing_status")}</span>
        </div>
      )}

      {/* Upload Button */}
      <label className={`cursor-pointer block w-full text-center border-2 border-dashed ${uploading ? 'border-gray-300 bg-gray-100 cursor-not-allowed' : 'border-lightBlue-500 hover:bg-lightBlue-50'} text-lightBlue-600 font-bold py-3 px-4 rounded transition-all duration-200 text-sm`}>
        <i className="fas fa-cloud-upload-alt mr-2 text-lg"></i> 
        {uploading ? t("processing") : (hasCV ? t("cv_upload_more", "Tải lên CV khác") : t("cv_upload_now"))}
        <input 
            type="file" 
            className="hidden" 
            accept=".pdf"
            disabled={uploading}
            onChange={handleFileChange} 
        />
      </label>
      <p className="text-xs text-blueGray-400 mt-2 text-center italic">
        {t("cv_hint")}
      </p>
    </div>
  );
}