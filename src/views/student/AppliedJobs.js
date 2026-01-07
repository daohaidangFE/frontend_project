import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import applyingService from "services/applyingService";

export default function AppliedJobs() {
  const { t } = useTranslation();

  // state
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch applications
  useEffect(() => {
    let active = true;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await applyingService.getMyApplications();
        const data = res?.data?.data || [];
        if (active) setApplications(data);
      } catch (err) {
        console.error(err);
        toast.error(t("fetch_error", "Không thể tải lịch sử ứng tuyển"));
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchApplications();
    return () => (active = false);
  }, [t]);

  // status badge
  const renderStatus = (status) => {
    switch (status) {
      case "SHORTLISTED":
      case "INTERVIEW":
      case "HIRED":
        return (
          <span className="bg-emerald-100 text-emerald-600 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <i className="fas fa-check-circle mr-1"></i>
            {t("status_shortlisted", "Đã được duyệt")}
          </span>
        );

      case "REJECTED":
        return (
          <span className="bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <i className="fas fa-times-circle mr-1"></i>
            {t("status_rejected", "Bị từ chối")}
          </span>
        );

      case "VIEWED":
        return (
          <span className="bg-lightBlue-100 text-lightBlue-600 border border-lightBlue-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <i className="fas fa-eye mr-1"></i>
            {t("status_viewed", "NTD đã xem")}
          </span>
        );

      default:
        return (
          <span className="bg-orange-100 text-orange-600 border border-orange-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <i className="fas fa-clock mr-1"></i>
            {t("status_submitted", "Đã nộp đơn")}
          </span>
        );
    }
  };

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-blueGray-700">
            {t("my_applications", "Việc làm đã ứng tuyển")}
          </h2>
          <p className="text-blueGray-500 mt-1">
            {t("track_app_status_desc", "Theo dõi trạng thái hồ sơ ứng tuyển")}
          </p>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b bg-blueGray-50">
            <h3 className="font-bold text-lg text-blueGray-700">
              {t("application_history", "Lịch sử ứng tuyển")}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-left bg-blueGray-50 text-blueGray-500 uppercase">
                    {t("job_company_header", "Công việc / Công ty")}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-left bg-blueGray-50 text-blueGray-500 uppercase">
                    {t("applied_date_header", "Ngày ứng tuyển")}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-left bg-blueGray-50 text-blueGray-500 uppercase">
                    {t("status_header", "Trạng thái")}
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-left bg-blueGray-50 text-blueGray-500 uppercase">
                    {t("action_header", "Hành động")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10">
                      <i className="fas fa-spinner fa-spin text-2xl text-brand"></i>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10">
                      <p className="text-blueGray-500 mb-2">
                        {t("no_applications_msg", "Bạn chưa ứng tuyển công việc nào")}
                      </p>
                      <Link to="/jobs" className="text-brand font-bold hover:underline">
                        {t("find_jobs_now", "Tìm việc ngay")}
                      </Link>
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-blueGray-50 transition-colors">
                      {/* Cột 1: Info */}
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full border flex items-center justify-center mr-3 bg-white p-1">
                            {app.companyLogo ? (
                              <img
                                src={app.companyLogo}
                                alt="logo"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <i className="fas fa-building text-blueGray-400 text-xl"></i>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-blueGray-700">
                              {app.jobTitle || "N/A"}
                            </div>
                            <div className="text-blueGray-500">
                              {app.companyName || "Unknown"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Date */}
                      <td className="px-6 py-4 text-xs text-blueGray-600">
                        {app.appliedAt
                          ? new Date(app.appliedAt).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </td>

                      {/* Cột 3: Status */}
                      <td className="px-6 py-4 text-xs">
                        {renderStatus(app.status)}
                        {app.status === "REJECTED" && app.note && (
                          <div
                            className="text-red-500 italic mt-1 truncate max-w-xs cursor-help"
                            title={app.note}
                          >
                            {t("reason_label", "Lý do")}: {app.note}
                          </div>
                        )}
                      </td>

                      {/* Cột 4: Action */}
                      <td className="px-6 py-4 text-xs">
                        <Link
                          to={`/student/jobs/${app.jobPostId}`}
                          className="text-lightBlue-500 font-bold hover:text-lightBlue-600"
                        >
                          <i className="fas fa-external-link-alt mr-1"></i>
                          {t("view_jd_label", "Xem JD")}
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}