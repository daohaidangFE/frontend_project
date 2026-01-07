import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function AboutCard({ profile, onEdit }) { 
  const { t } = useTranslation();

  // Helper hiển thị giới tính
  const displayGender = (gender) => {
    if (!gender) return "---";
    // Giả sử backend trả về "MALE", "FEMALE", "OTHER"
    const key = `gender_${gender.toLowerCase()}`;
    return t(key, gender); // Fallback về giá trị gốc nếu không tìm thấy key
  };

  // Helper hiển thị ngày sinh
  const displayDob = (dob) => {
      if (!dob) return "---";
      return new Date(dob).toLocaleDateString("vi-VN");
  };

  return (
    <div className="text-left relative group bg-white p-6 rounded shadow-lg mb-6">
      <div className="flex justify-between items-end mb-4 border-b border-blueGray-100 pb-2">
         <h3 className="text-2xl font-bold text-blueGray-700">
            {t("about_me")}
         </h3>
         <button 
            onClick={onEdit} 
            className="text-lightBlue-500 text-sm font-bold uppercase hover:text-lightBlue-700 transition-colors focus:outline-none"
         >
            <i className="fas fa-pen mr-1"></i> {t("edit")}
         </button>
      </div>
      
      {/* Bio Content */}
      <div className="text-blueGray-600 text-lg leading-relaxed whitespace-pre-line">
        {profile.bio || <span className="text-blueGray-400 italic">{t("bio_placeholder")}</span>}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-3 bg-blueGray-50 rounded border border-blueGray-100">
            <span className="block text-xs font-bold text-blueGray-500 uppercase tracking-wide mb-1">
                {t("gender")}
            </span>
            <span className="text-blueGray-700 font-medium">
                {displayGender(profile.gender)}
            </span>
         </div>
         <div className="p-3 bg-blueGray-50 rounded border border-blueGray-100">
            <span className="block text-xs font-bold text-blueGray-500 uppercase tracking-wide mb-1">
                {t("date_of_birth")}
            </span>
            <span className="text-blueGray-700 font-medium">
                {displayDob(profile.dob)}
            </span>
         </div>
      </div>
    </div>
  );
}

AboutCard.propTypes = {
    profile: PropTypes.object.isRequired,
    onEdit: PropTypes.func
};