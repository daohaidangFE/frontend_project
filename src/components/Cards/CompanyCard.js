import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function CompanyCard({ company }) {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name || "C")}&background=e2e8f0&color=64748b&size=80`;

  return (
    // Thêm h-full để div cha luôn giãn hết chiều cao của cột trong Grid
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full h-full mb-6 shadow-lg rounded-lg hover:shadow-xl transition-all duration-200 border border-blueGray-100">
      <div className="px-4 py-5 flex-auto flex flex-col">
        
        {/* Header: Logo + Name */}
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-blueGray-50 bg-blueGray-50 flex items-center justify-center">
              <img 
                src={(!company.logoUrl || imgError) ? defaultAvatar : company.logoUrl} 
                alt={company.name} 
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <h5 className="text-base font-bold text-blueGray-700 truncate">
              {company.name}
            </h5>
            <div className="text-[11px] text-blueGray-400 truncate">
              <i className="fas fa-map-marker-alt mr-1"></i> {company.address || "Vietnam"}
            </div>
          </div>
        </div>

        {/* Industry & Size Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-[9px] font-bold px-2 py-0.5 bg-blueGray-100 text-blueGray-600 rounded uppercase">
            {company.industry || t('unknown')}
          </span>
          <span className="text-[9px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded uppercase">
            {company.companySize || "N/A"}
          </span>
        </div>

        {/* --- PHẦN MÔ TẢ (ĐÃ SỬA) --- */}
        <div className="flex-grow"> {/* flex-grow để đẩy nút bấm xuống đáy card */}
          <p className="text-blueGray-500 text-xs leading-relaxed line-clamp-3 italic mb-4">
            {company.description || t('no_description', 'Chưa có mô tả chi tiết về công ty.')}
          </p>
        </div>

        {/* Website Button - Luôn nằm sát đáy nhờ flex-col */}
        {company.websiteUrl && (
          <a 
            href={company.websiteUrl.startsWith('http') ? company.websiteUrl : `https://${company.websiteUrl}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center bg-blueGray-50 text-blueGray-600 font-bold text-[10px] uppercase px-3 py-2 rounded hover:bg-blueGray-200 transition-all"
          >
            <i className="fas fa-external-link-alt mr-2"></i> {t('visit_website')}
          </a>
        )}
      </div>
    </div>
  );
}
// ... PropTypes giữ nguyên
CompanyCard.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    logoUrl: PropTypes.string,
    address: PropTypes.string,
    industry: PropTypes.string,
    companySize: PropTypes.string,
    description: PropTypes.string,
    websiteUrl: PropTypes.string,
  }).isRequired,
};