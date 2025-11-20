import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import hook

export default function JobCard({ job }) {
  const { t } = useTranslation(); // Sử dụng hook

  const getWorkModeColor = (mode) => {
     if (!mode) return "bg-blueGray-200 text-blueGray-600";
     switch (mode.toUpperCase()) {
       case "REMOTE": return "bg-purple-200 text-purple-600";
       case "ONSITE": return "bg-emerald-200 text-emerald-600";
       case "HYBRID": return "bg-lightBlue-200 text-lightBlue-600";
       default: return "bg-blueGray-200 text-blueGray-600";
     }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg hover:shadow-xl transition-all duration-200 border border-blueGray-100">
      <div className="px-4 py-5 flex-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
            <div className="text-blueGray-500 font-bold text-xs uppercase truncate pr-2" title={job.companyName}>
                <i className="fas fa-building mr-2"></i>
                {/* Sử dụng t('unknown_company') */}
                {job.companyName || t('unknown_company')} 
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded uppercase whitespace-nowrap ${getWorkModeColor(job.workMode)}`}>
                {job.workMode}
            </span>
        </div>

        {/* Title */}
        <Link to={`/student/jobs/${job.id}`}>
            <h5 className="text-xl font-bold text-blueGray-700 mb-2 hover:text-brand transition-colors cursor-pointer line-clamp-2 h-14">
            {job.title}
            </h5>
        </Link>
        
        <p className="text-sm text-blueGray-500 mb-4 font-semibold truncate">
            {job.position}
        </p>

        {/* Details */}
        <div className="flex flex-wrap items-center text-sm text-blueGray-500 gap-4 mb-4">
            <div className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2 text-blueGray-400"></i>
                {job.location}
            </div>
            {job.expiredAt && (
                 <div className="flex items-center text-orange-500">
                    <i className="fas fa-clock mr-2"></i>
                    {new Date(job.expiredAt).toLocaleDateString('vi-VN')}
                </div>
            )}
        </div>
        
        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-blueGray-100">
             <Link to={`/student/jobs/${job.id}`}>
                <button className="w-full bg-white text-brand border border-brand active:bg-brand active:text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                    {t('view_details')} {/* <--- Thay đổi */}
                </button>
             </Link>
        </div>
      </div>
    </div>
  );
}

JobCard.propTypes = {
  job: PropTypes.object.isRequired,
};