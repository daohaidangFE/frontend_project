import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import cvService from 'services/cvService';

export default function CVCard({ profile, onUploadSuccess }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const cvStatus = profile.cvUrl
    ? t('uploaded', 'Đã tải lên')
    : t('not_uploaded', 'Chưa tải lên');

  /** Mở input file ẩn */
  const handleButtonClick = () => fileInputRef.current.click();

  /** Upload file khi người dùng chọn */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File quá lớn (Max 10MB)");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      await cvService.uploadCV(file, file.name);
      onUploadSuccess && onUploadSuccess();
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(t('upload_failed', 'Tải lên thất bại. Vui lòng thử lại.'));
    } finally {
      setIsUploading(false);
      event.target.value = null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-blueGray-200 relative">
      
      {/* Loading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 z-10 flex flex-col items-center justify-center rounded-lg">
          <i className="fas fa-circle-notch fa-spin text-3xl text-brand mb-2"></i>
          <p className="text-sm font-semibold text-blueGray-600">
            {t('analyzing_cv', 'Đang tải lên & phân tích AI...')}
          </p>
        </div>
      )}

      <h3 className="text-lg font-bold text-blueGray-700 mb-4">
        {t('cv', 'CV & Hồ sơ')}
      </h3>

      <div className="space-y-3 mb-4">
        
        {/* Trạng thái CV */}
        <div className="text-sm">
          <label className="text-xs text-blueGray-500 uppercase font-bold">
            {t('cv_status', 'Trạng thái CV')}
          </label>
          <p className={`font-semibold ${profile.cvUrl ? 'text-emerald-500' : 'text-blueGray-400'}`}>
            {cvStatus}
          </p>
        </div>

        {/* Link xem CV */}
        <div className="text-sm">
          <label className="text-xs text-blueGray-500 uppercase font-bold">
            {t('view_cv', 'CV hiện tại')}
          </label>
          <p className="text-brand truncate">
            {profile.cvUrl ? (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-2 font-medium"
              >
                <i className="fas fa-file-pdf text-red-500 text-lg"></i>
                {profile.cvName || profile.cvUrl.split('/').pop().split('?')[0] || "My_CV.pdf"}
              </a>
            ) : t('not_updated', 'Chưa cập nhật')}
          </p>
        </div>
      </div>

      {uploadError && (
        <p className="text-red-500 text-xs mb-3 italic">{uploadError}</p>
      )}

      {/* Input file ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {/* Nút Upload */}
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="bg-brand text-white w-full py-2 px-4 rounded-lg font-bold text-sm flex items-center justify-center shadow hover:shadow-lg hover:opacity-90 transition-all"
      >
        <i className="fas fa-cloud-upload-alt mr-2"></i>
        {profile.cvUrl
          ? t('update_cv', 'Cập nhật CV mới')
          : t('upload_cv', 'Tải CV lên')}
      </button>

      <p className="text-blueGray-400 text-xs mt-2 text-center">
        *Hỗ trợ PDF, DOCX. Tối đa 10MB.
      </p>
    </div>
  );
}

CVCard.propTypes = {
  profile: PropTypes.object.isRequired,
  onUploadSuccess: PropTypes.func,
};
