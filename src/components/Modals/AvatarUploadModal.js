import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const AvatarUploadModal = ({ isOpen, onClose, onUploadSuccess, currentAvatarUrl }) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t("invalid_file_type", "Vui lòng chọn file ảnh"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t("file_too_large", "Kích thước file không được vượt quá 5MB"));
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await onUploadSuccess(selectedFile);
      handleClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert(t("upload_error", "Có lỗi xảy ra khi tải ảnh lên"));
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-60"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full z-[10000]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-xl font-bold text-blueGray-700">
            <i className="fas fa-camera mr-2 text-lightBlue-500"></i>
            {t("update_avatar", "Cập nhật ảnh đại diện")}
          </h3>
          <button
            className="text-blueGray-400 hover:text-red-500 text-2xl outline-none"
            onClick={handleClose}
            disabled={uploading}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Current Avatar */}
          <div className="text-center mb-6">
            <p className="text-sm text-blueGray-600 mb-3">
              {t("current_avatar", "Ảnh hiện tại")}
            </p>
            <div className="flex justify-center">
              {currentAvatarUrl ? (
                <img
                  src={currentAvatarUrl}
                  alt="Current avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blueGray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blueGray-200 flex items-center justify-center border-4 border-blueGray-300">
                  <i className="fas fa-user text-5xl text-blueGray-400"></i>
                </div>
              )}
            </div>
          </div>

          {/* Preview New Avatar */}
          {previewUrl && (
            <div className="text-center mb-6">
              <p className="text-sm text-blueGray-600 mb-3">
                {t("new_avatar", "Ảnh mới")}
              </p>
              <div className="flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-lightBlue-500"
                />
              </div>
            </div>
          )}

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Select Button */}
          {!selectedFile && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blueGray-700 hover:bg-blueGray-800 text-white font-bold py-3 px-4 rounded shadow hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2"
            >
              <i className="fas fa-image"></i>
              {t("select_image", "Chọn ảnh")}
            </button>
          )}

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-blueGray-50 p-4 rounded-lg border border-blueGray-200 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blueGray-700 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-blueGray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="ml-4 text-red-500 hover:text-red-700"
                  disabled={uploading}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-blueGray-50">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="bg-white hover:bg-blueGray-50 text-blueGray-700 font-bold py-2 px-6 rounded border border-blueGray-300 shadow hover:shadow-lg transition-all duration-150"
          >
            {t("cancel", "Hủy")}
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white font-bold py-2 px-6 rounded shadow hover:shadow-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {t("uploading", "Đang tải lên...")}
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i>
                {t("upload", "Tải lên")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal;