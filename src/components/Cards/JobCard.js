import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function JobCard({ job }) {
  const { t } = useTranslation();

  // Helper function format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full h-full shadow-lg rounded-lg hover:-translate-y-1 transition-all duration-200 border border-transparent hover:border-blueGray-200">
      
      {/* --- HIỂN THỊ ĐIỂM MATCH --- */}
      {job.matchScore !== undefined && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border-2 border-white">
            <i className="fas fa-bullseye mr-1"></i>
            {Math.round(job.matchScore * 100)}% Match
          </div>
        </div>
      )}

      <div className="px-4 py-5 flex-auto flex flex-col">
        {/* Header: Logo & Company Name */}
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-blueGray-100 flex items-center justify-center text-blueGray-500 mr-3 flex-shrink-0 overflow-hidden border border-blueGray-200 p-2">
            {job.companyLogo ? (
              <img 
                src={job.companyLogo} 
                alt={job.companyName}
                className="w-full h-full object-cover rounded-full" 
                onError={(e) => {
                    e.target.style.display = 'none';
                    const iconSibling = e.target.parentNode.querySelector('i');
                    if (iconSibling) iconSibling.style.display = 'block';
                }}
              />
            ) : null}
            <i className="fas fa-building" style={{ display: job.companyLogo ? 'none' : 'block', fontSize: '1.1rem' }}></i>
          </div>

          <h6 className="text-blueGray-500 text-xs font-bold uppercase truncate">
            {job.companyName || t('unknown_company')}
          </h6>
        </div>

        {/* Job Title */}
        <Link to={`/student/jobs/${job.id}`} className="block mb-2">
          <h5 className="text-lg font-bold text-blueGray-700 hover:text-brand transition-colors line-clamp-2 min-h-[56px]">
            {job.title}
          </h5>
        </Link>

        {/* --- HIỂN THỊ SKILL MATCH --- */}
        {job.matchedSkills && job.matchedSkills.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {job.matchedSkills.slice(0, 3).map((skill, index) => (
                <span key={index} className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                  <i className="fas fa-check mr-1"></i>{skill}
                </span>
              ))}
              {job.matchedSkills.length > 3 && (
                <span className="text-[10px] text-blueGray-400 font-bold self-center">
                  +{job.matchedSkills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags: WorkMode & Position */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-emerald-600 bg-emerald-100 uppercase">
            {job.workMode}
          </span>
          {job.position && (
            <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-lightBlue-600 bg-lightBlue-100 uppercase">
              {job.position}
            </span>
          )}
        </div>

        {/* Location & Expiration Date */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center text-blueGray-500 text-xs">
            <i className="fas fa-map-marker-alt mr-2 text-blueGray-400 w-4 text-center"></i>
            <span className="truncate">{job.location || t('location_not_specified')}</span>
          </div>
          
          {/* Ngày hết hạn làm đẹp ở đây */}
          {job.expiredAt && (
            <div className="flex items-center text-red-500 text-xs font-medium">
              <i className="fas fa-calendar-times mr-2 w-4 text-center"></i>
              <span>{t('expires')}: {formatDate(job.expiredAt)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-blueGray-500 text-sm mb-4 line-clamp-3 flex-grow italic">
          {job.description}
        </p>

        {/* Footer: Created Date & Detail Link */}
        <div className="border-t border-blueGray-100 pt-4 mt-auto flex justify-between items-center">
          <span className="text-xs text-blueGray-400">
            <i className="far fa-clock mr-1"></i>
            {formatDate(job.createdAt)}
          </span>
          <Link
            to={`/student/jobs/${job.id}`}
            className="text-brand font-bold text-xs uppercase hover:underline"
          >
            {t('view_detail')} <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}