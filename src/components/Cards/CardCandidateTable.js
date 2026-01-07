import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // 1. Import hook

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN", {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case "SUBMITTED": 
    case "PENDING": return "text-lightBlue-600 bg-lightBlue-100";
    case "VIEWED": return "text-orange-500 bg-orange-100";
    case "INTERVIEW": return "text-emerald-600 bg-emerald-100";
    case "REJECTED": return "text-red-500 bg-red-100";
    default: return "text-blueGray-500 bg-blueGray-100";
  }
};

export default function CardCandidateTable({ candidates, pagination, onPageChange, isLoading, color = "light" }) {
  const { t } = useTranslation(); // 2. Khởi tạo t
  const { pageNumber, totalPages } = pagination;

  return (
    <>
      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " + (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className={"font-semibold text-lg " + (color === "light" ? "text-blueGray-700" : "text-white")}>
                {t('candidate_list_title')} ({pagination?.totalElements || 0})
              </h3>
            </div>
          </div>
        </div>
        
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('candidate_header')}
                </th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('status_header')}
                </th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('applied_date_header')}
                </th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('action_header')}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                 <tr><td colSpan="4" className="text-center py-4 p-4">{t('loading')}</td></tr>
              ) : candidates.length === 0 ? (
                 <tr><td colSpan="4" className="text-center py-4 p-4">{t('no_candidates_applied')}</td></tr>
              ) : (
                candidates.map((app) => (
                  <tr key={app.id}>
                    {/* Cột 1: Ứng viên */}
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                      <img
                        src={app.studentAvatar || "https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"} 
                        className="h-12 w-12 bg-white rounded-full border shadow-sm object-cover"
                        alt="..."
                      />
                      <div className="ml-3">
                          <span className={"font-bold block " + (color === "light" ? "text-blueGray-600" : "text-white")}>
                            {app.studentName}
                          </span>
                          {/* Chỉ hiện Headline nếu có dữ liệu */}
                          {app.studentHeadline && (
                            <div className="text-xs text-blueGray-400">{app.studentHeadline}</div>
                          )}
                      </div>
                    </td>

                    {/* Cột 2: Trạng thái */}
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <span className={`px-2 py-1 rounded font-bold text-xs ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Cột 3: Thời gian nộp */}
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {formatDate(app.appliedAt)}
                    </td>

                    {/* Cột 4: Hành động */}
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <Link 
                        to={`/employer/candidates/${app.id}`} 
                        className="text-lightBlue-500 hover:text-lightBlue-700 font-bold text-xs uppercase bg-lightBlue-100 px-3 py-2 rounded transition-colors"
                      >
                        <i className="fas fa-eye mr-1"></i> {t('view_profile_action')}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="py-3 px-4 flex justify-end gap-2 border-t border-blueGray-100 bg-blueGray-50 rounded-b">
             <button
                disabled={pageNumber === 0}
                onClick={() => onPageChange(pageNumber - 1)}
                className={`px-3 py-1 rounded text-xs font-semibold uppercase border ${pageNumber === 0 ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-indigo-500 border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all'}`}
             >
               {t('prev')}
             </button>
             <span className="text-xs flex items-center font-semibold text-blueGray-600 px-2">
               {t('page_info', { page: pageNumber + 1, total: totalPages })}
             </span>
             <button
                disabled={pageNumber >= totalPages - 1}
                onClick={() => onPageChange(pageNumber + 1)}
                className={`px-3 py-1 rounded text-xs font-semibold uppercase border ${pageNumber >= totalPages - 1 ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-indigo-500 border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all'}`}
             >
               {t('next')}
             </button>
          </div>
        )}
      </div>
    </>
  );
}

CardCandidateTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};