import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
// apiClient để sẵn, sau này thay mock bằng API thật
import apiClient from "services/apiClient";
import { toast } from "react-toastify";

export default function AppliedJobs() {
  const { t } = useTranslation();

  // ===== STATE =====
  const [applications, setApplications] = useState([]); // danh sách job đã apply
  const [loading, setLoading] = useState(true);

  // ===== FETCH DATA (MOCK) =====
  useEffect(() => {
    // Sau này thay bằng:
    // const res = await apiClient.get("/student/applications");

    setTimeout(() => {
      setApplications([
        {
          id: 1,
          jobTitle: "Frontend Developer (ReactJS)",
          companyName: "FPT Software",
          companyLogo: "https://via.placeholder.com/150",
          appliedAt: "2025-12-20",
          status: "PENDING", // PENDING | APPROVED | REJECTED
        },
        {
          id: 2,
          jobTitle: "Backend Developer (Java Spring)",
          companyName: "Viettel Digital Services",
          companyLogo: null,
          appliedAt: "2025-12-15",
          status: "APPROVED",
        },
        {
          id: 3,
          jobTitle: "DevOps Intern",
          companyName: "VNG Corporation",
          companyLogo: null,
          appliedAt: "2025-12-10",
          status: "REJECTED",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // ===== RENDER STATUS BADGE =====
  const renderStatus = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="bg-emerald-100 text-emerald-600 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <i className="fas fa-check-circle mr-1"></i>
            {t("status_approved", "Được chấp nhận")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <i className="fas fa-times-circle mr-1"></i>
            {t("status_rejected", "Bị từ chối")}
          </span>
        );
      default: // PENDING
        return (
          <span className="bg-orange-100 text-orange-600 border border-orange-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <i className="fas fa-clock mr-1"></i>
            {t("status_pending", "Đang chờ duyệt")}
          </span>
        );
    }
  };

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blueGray-700">
              {t("my_applications", "Việc làm đã ứng tuyển")}
            </h2>
            <p className="text-blueGray-500 mt-1">
              Theo dõi trạng thái hồ sơ ứng tuyển của bạn.
            </p>
          </div>
        </div>

        {/* ===== TABLE CARD ===== */}
        <div className="w-full px-4">
          <div className="flex flex-col bg-white rounded-lg shadow-lg">

            {/* Card header */}
            <div className="px-6 py-4 border-b bg-blueGray-50">
              <h3 className="font-bold text-lg text-blueGray-700">
                {t("application_history", "Lịch sử ứng tuyển")}
              </h3>
            </div>

            {/* Table */}
            <div className="block w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs uppercase text-left font-bold bg-blueGray-50 text-blueGray-500">
                      {t("job_info", "Công việc / Công ty")}
                    </th>
                    <th className="px-6 py-3 text-xs uppercase text-left font-bold bg-blueGray-50 text-blueGray-500">
                      {t("applied_date", "Ngày ứng tuyển")}
                    </th>
                    <th className="px-6 py-3 text-xs uppercase text-left font-bold bg-blueGray-50 text-blueGray-500">
                      {t("status", "Trạng thái")}
                    </th>
                    <th className="px-6 py-3 text-xs uppercase text-left font-bold bg-blueGray-50 text-blueGray-500">
                      {t("action", "Hành động")}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Loading */}
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10">
                        <i className="fas fa-spinner fa-spin text-2xl text-brand"></i>
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    /* Empty state */
                    <tr>
                      <td colSpan="4" className="text-center py-10">
                        <div className="flex flex-col items-center">
                          <i className="fas fa-folder-open text-4xl text-blueGray-300 mb-3"></i>
                          <p className="text-blueGray-500">
                            Bạn chưa ứng tuyển công việc nào.
                          </p>
                          <Link
                            to="/student/jobs"
                            className="mt-2 text-brand font-bold hover:underline"
                          >
                            Tìm việc ngay
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    /* Data rows */
                    applications.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-blueGray-50 transition-colors"
                      >
                        {/* Job + Company */}
                        <td className="px-6 py-4 text-xs">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full border flex items-center justify-center mr-3 overflow-hidden">
                              {app.companyLogo ? (
                                <img
                                  src={app.companyLogo}
                                  alt="logo"
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <i className="fas fa-building text-blueGray-400"></i>
                              )}
                            </div>
                            <div>
                              <span className="block font-bold text-sm">
                                {app.jobTitle}
                              </span>
                              <span className="block text-xs text-blueGray-500">
                                {app.companyName}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Applied date */}
                        <td className="px-6 py-4 text-xs">
                          <i className="far fa-calendar-alt mr-2 text-blueGray-400"></i>
                          {new Date(app.appliedAt).toLocaleDateString("vi-VN")}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-xs">
                          {renderStatus(app.status)}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-xs">
                          <Link
                            to={`/student/jobs/${app.id}`}
                            className="text-brand font-bold hover:text-lightBlue-600"
                          >
                            {t("view_detail", "Xem lại Job")}
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
    </div>
  );
}
