import React from "react";
import { useTranslation } from "react-i18next";
// Bỏ import toast vì không dùng nữa

export default function AboutCard({ profile, onEdit }) { // Thêm prop onEdit
  const { t } = useTranslation();

  return (
    <div className="text-left relative group">
      <div className="flex justify-between items-end mb-4 border-b border-blueGray-100 pb-2">
         <h3 className="text-2xl font-bold text-blueGray-700">
            {t("profile.about_me", "Giới thiệu")}
         </h3>
         <button 
            onClick={onEdit} // Gọi hàm mở Modal từ cha
            className="text-lightBlue-500 text-sm font-bold uppercase hover:text-lightBlue-700 transition-colors focus:outline-none"
         >
            <i className="fas fa-pen mr-1"></i> {t("common.edit", "Sửa")}
         </button>
      </div>
      
      {/* ... Phần hiển thị nội dung giữ nguyên ... */}
      <div className="text-blueGray-600 text-lg leading-relaxed whitespace-pre-line">
        {profile.bio || <span className="text-blueGray-400 italic">{t("profile.bio_placeholder", "Chưa cập nhật giới thiệu.")}</span>}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-3 bg-blueGray-50 rounded">
            <span className="block text-xs font-bold text-blueGray-500 uppercase tracking-wide mb-1">{t("profile.gender", "Giới tính")}</span>
            <span className="text-blueGray-700 font-medium">{profile.gender || "---"}</span>
         </div>
         <div className="p-3 bg-blueGray-50 rounded">
            <span className="block text-xs font-bold text-blueGray-500 uppercase tracking-wide mb-1">{t("profile.dob", "Ngày sinh")}</span>
            <span className="text-blueGray-700 font-medium">{profile.dob || "---"}</span>
         </div>
      </div>
    </div>
  );
}