import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import cvService from "services/cvService";

export default function CVCard({ profile, onUploadSuccess }) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const hasCV = !!profile.cvUrl;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate client-side
    if (file.type !== "application/pdf") {
      toast.warning(t("cv.invalid_format", "Vui lòng chỉ tải lên file PDF."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.warning(t("cv.file_too_large", "File quá lớn (Tối đa 5MB)."));
      return;
    }

    setUploading(true);
    try {
      await cvService.uploadCV(file);
      toast.success(t("cv.upload_success", "Tải lên CV thành công!"));
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error(t("cv.upload_failed", "Lỗi khi tải lên CV. Vui lòng thử lại."));
    } finally {
      setUploading(false);
      e.target.value = null; // Reset input
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blueGray-200 p-5">
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-lg font-bold text-blueGray-700">{t("cv.title", "Hồ sơ đính kèm (CV)")}</h5>
        {uploading && <i className="fas fa-spinner fa-spin text-lightBlue-500"></i>}
      </div>
      
      {hasCV ? (
        <div className="mb-4">
            <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 px-4 py-3 rounded text-sm mb-3 flex items-center">
                <i className="fas fa-check-circle mr-2 text-lg"></i> 
                <span className="font-semibold">{t("cv.status_uploaded", "Đã có CV trên hệ thống")}</span>
            </div>
            <a 
                href={profile.cvUrl} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center bg-blueGray-700 hover:bg-blueGray-800 text-white font-bold py-2 px-4 rounded transition-colors duration-150 text-sm shadow hover:shadow-lg"
            >
                <i className="fas fa-eye mr-2"></i> {t("cv.view_download", "Xem / Tải xuống")}
            </a>
        </div>
      ) : (
        <div className="bg-orange-100 border border-orange-200 text-orange-700 px-4 py-3 rounded text-sm mb-4 flex items-center">
            <i className="fas fa-exclamation-triangle mr-2 text-lg"></i> 
            <span>{t("cv.status_missing", "Bạn chưa tải lên CV nào.")}</span>
        </div>
      )}

      {/* Upload Button */}
      <label className={`cursor-pointer block w-full text-center border-2 border-dashed ${uploading ? 'border-gray-300 bg-gray-100 cursor-not-allowed' : 'border-lightBlue-500 hover:bg-lightBlue-50'} text-lightBlue-600 font-bold py-3 px-4 rounded transition-all duration-200 text-sm`}>
        <i className="fas fa-cloud-upload-alt mr-2 text-lg"></i> 
        {uploading ? t("common.processing", "Đang xử lý...") : (hasCV ? t("cv.update_new", "Cập nhật CV mới") : t("cv.upload_now", "Tải lên ngay"))}
        <input 
            type="file" 
            className="hidden" 
            accept=".pdf"
            disabled={uploading}
            onChange={handleFileChange} 
        />
      </label>
      <p className="text-xs text-blueGray-400 mt-2 text-center italic">
        {t("cv.hint", "Hỗ trợ định dạng PDF, tối đa 5MB")}
      </p>
    </div>
  );
}