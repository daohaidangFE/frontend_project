import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function CompanyCard({ company }) {
  const { t } = useTranslation();
  
  const [imgError, setImgError] = useState(false);

  const defaultAvatar = "https://ui-avatars.com/api/?name=Unknown&background=e2e8f0&color=64748b&size=128";

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg hover:shadow-xl transition-all duration-200 border border-blueGray-100">
      <div className="px-4 py-5 flex-auto">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-blueGray-200 bg-blueGray-50 flex items-center justify-center">
              <img 
                src={(!company.logoUrl || imgError) ? defaultAvatar : company.logoUrl} 
                alt={company.name} 
                // object-cover là chìa khóa để ảnh không bị méo, lấp đầy vòng tròn
                className="w-full h-full object-cover"
                // Nếu load ảnh bị lỗi, lập tức chuyển sang ảnh mặc định
                onError={() => setImgError(true)}
              />
            </div>
          </div>
          
          {/* Info */}
          <div className="ml-4 flex-1">
            <h5 className="text-xl font-bold text-blueGray-700 hover:text-brand transition-colors cursor-pointer truncate">
              {company.name}
            </h5>
            <div className="text-sm text-blueGray-500 mt-1 flex items-center">
              <i className="fas fa-map-marker-alt mr-2 text-blueGray-400"></i> 
              <span className="truncate">{company.address || "Vietnam"}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blueGray-100">
          <div className="flex flex-wrap gap-4 text-sm text-blueGray-600">
            <div className="flex items-center">
              <span className="font-bold mr-1">{t('industry')}:</span> 
              <span className="text-blueGray-500">{company.industry || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-1">{t('company_size')}:</span> 
              <span className="text-blueGray-500">{company.companySize || "N/A"}</span>
            </div>
          </div>
          
          {/* Description - Giới hạn 2 dòng để layout luôn đều */}
          <p className="mt-3 text-blueGray-500 text-sm line-clamp-2 h-10 italic">
            {company.description || "Chưa có mô tả."}
          </p>

          {/* Website Button */}
          {company.websiteUrl && (
            <a 
              href={company.websiteUrl.startsWith('http') ? company.websiteUrl : `https://${company.websiteUrl}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 block w-full text-center bg-lightBlue-50 text-lightBlue-600 font-bold text-xs uppercase px-4 py-2 rounded hover:bg-lightBlue-100 transition-all shadow-sm"
            >
              <i className="fas fa-globe mr-2"></i> {t('visit_website')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

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