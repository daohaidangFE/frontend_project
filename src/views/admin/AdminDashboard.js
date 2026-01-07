import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import apiClient from "services/apiClient"; 

import StatCard from "components/Cards/StatCard";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const history = useHistory();

  // State lưu số liệu
  const [counts, setCounts] = useState({
    users: 0,
    jobs: 0,
    pendingJobs: 0
  });

  // State lưu danh sách chờ duyệt
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);


      const userRes = await apiClient.get("/auth/v1/admin/users", {
        params: { page: 0, size: 1 }
      });
      const totalUsers = userRes.data?.data?.totalItems || 0;


      const pendingRes = await apiClient.get("/internship-post/admin/pending");
      const pendingData = pendingRes.data?.data || [];

      const jobRes = await apiClient.get("/internship-post/search", {
        params: { page: 0, size: 1 }
      });
      const totalJobs = jobRes.data?.data?.totalElements || 0;

      // Cập nhật State thống kê
      setCounts({
        users: totalUsers,
        pendingJobs: pendingData.length,
        jobs: totalJobs
      });

      const sortedPending = [...pendingData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPendingList(sortedPending.slice(0, 5));

    } catch (error) {
      console.error("Lỗi tải Admin Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- PHẦN 1: CÁC THẺ THỐNG KÊ (STAT CARDS) --- */}
      <div className="flex flex-wrap">
        
        {/* Card 1: Tổng người dùng */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard
            title={t('total_users') || "Tổng người dùng"}
            value={loading ? "..." : counts.users}
            icon="fas fa-users"
            color="bg-lightBlue-500"
            footer={t('system_users') || "Hệ thống"}
            footerIcon="fas fa-database"
            footerColor="text-lightBlue-500"
          />
        </div>

        {/* Card 2: Tin chờ duyệt */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard
            title={t('pending_jobs') || "Tin chờ duyệt"}
            value={loading ? "..." : counts.pendingJobs}
            icon="fas fa-clock"
            color="bg-orange-500"
            footer={t('needs_action') || "Cần xử lý"}
            footerIcon="fas fa-exclamation-triangle"
            footerColor="text-orange-500"
          />
        </div>

        {/* Card 3: Tổng bài đăng */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard
            title={t('total_jobs') || "Tổng bài đăng"}
            value={loading ? "..." : counts.jobs}
            icon="fas fa-briefcase"
            color="bg-emerald-500"
            footer={t('active_posts') || "Đang hiển thị"}
            footerIcon="fas fa-check"
            footerColor="text-emerald-500"
          />
        </div>

        {/* Card 4: Shortcut Quản lý User */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <div 
             className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg cursor-pointer hover:bg-blueGray-50 transition transform hover:-translate-y-1 min-h-[140px]"
             onClick={() => history.push('/admin/users')}
          >
             <div className="flex-auto p-4 flex items-center justify-center flex-col h-full">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-indigo-500 mb-3">
                    <i className="fas fa-user-cog"></i>
                </div>
                <h5 className="text-blueGray-500 uppercase font-bold text-xs">
                    {t('manage_users') || "Quản lý User"}
                </h5>
             </div>
          </div>
        </div>
      </div>

      {/* --- PHẦN 2: BẢNG DANH SÁCH CHỜ DUYỆT --- */}
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            
            {/* Header Bảng */}
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    {t('pending_approvals') || "Danh sách chờ duyệt mới nhất"}
                  </h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <Link
                    to="/admin/job-approval" 
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    {t('view_all') || "Xem tất cả"}
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Nội dung Bảng */}
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      {t('job_title') || "Tiêu đề"}
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      {t('position') || "Vị trí"}
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      {t('posted_date') || "Ngày đăng"}
                    </th>
                    {/* <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                      {t('action') || "Hành động"}
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="4" className="text-center p-4">Loading...</td></tr>
                    ) : pendingList.length === 0 ? (
                        <tr><td colSpan="4" className="text-center p-4 text-blueGray-500">Không có bài đăng nào cần duyệt</td></tr>
                    ) : (
                        pendingList.map(job => (
                            <tr key={job.id}>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-blueGray-700">
                                    {job.title}
                                    {/* Hiển thị Location bên dưới title cho gọn */}
                                    <div className="text-xs font-normal text-blueGray-500">{job.location || "N/A"}</div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {job.position || "N/A"}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                    <Link 
                                        to={`/admin/jobs/${job.id}`} 
                                        className="text-white bg-orange-500 hover:bg-orange-600 font-bold text-xs px-3 py-1 rounded transition"
                                    >
                                        <i className="fas fa-search mr-1"></i> {t('view_and_approve')}
                                    </Link>
                                </td> */}
                            </tr>
                        ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}