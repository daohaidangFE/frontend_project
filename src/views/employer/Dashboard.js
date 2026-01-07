import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import jobService from "services/jobService";
import applyingService from "services/applyingService";
import StatCard from "components/Cards/StatCard";
import StatusBadge from "components/Shared/StatusBadge"; 

export default function EmployerDashboard() {
  const { t } = useTranslation();
  const history = useHistory();

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    closed: 0,
    newCandidates: 0,
    totalApplicants: 0
  });
  
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await jobService.getMyPosts(0, 100);
      
      let jobs = [];
      const payload = response.data;

      if (payload && payload.data && Array.isArray(payload.data.content)) {
          jobs = payload.data.content;
      } else {
          jobs = []; 
          console.warn("⚠️ Cấu trúc API không khớp mong đợi. Payload:", payload);
      }

      const activeCount = jobs.filter(job => job.status === 'ACTIVE').length;
      const closedCount = jobs.filter(job => ['EXPIRED', 'HIDDEN', 'REJECTED'].includes(job.status)).length;

      let newCandidatesCount = 0;
      let totalAppCount = 0;

      if (jobs.length > 0) {
          const jobIds = jobs.map(job => job.id);
          try {

              const statsRes = await applyingService.getDashboardStats(jobIds);
              const statsData = statsRes.data?.data;
              
              if (statsData) {
                  newCandidatesCount = statsData.newApplications || 0;
                  totalAppCount = statsData.totalApplications || 0;
              }
          } catch (err) {
              console.error("Lỗi API thống kê (Dashboard Stats):", err);
          }
      }

      setStats({
        total: payload?.data?.totalElements || jobs.length,
        active: activeCount,
        closed: closedCount,
        newCandidates: newCandidatesCount,
        totalApplicants: totalAppCount
      });

      const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRecentJobs(sortedJobs.slice(0, 5));

    } catch (error) {
      console.error("Lỗi tải dashboard (Fatal):", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- PHẦN 1: THẺ THỐNG KÊ --- */}
      <div className="flex flex-wrap">
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title={t('active_jobs')}
            value={loading ? "..." : stats.active}
            icon="fas fa-briefcase"
            color="bg-emerald-500"
            footer={t('total_posted')}
            footerValue={stats.total}
            footerIcon="fas fa-file-alt"
            footerColor="text-blueGray-500"
          />
        </div>

        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title={t('new_candidates')}
            value={loading ? "..." : stats.newCandidates}
            icon="fas fa-users"
            color="bg-lightBlue-500"
            footer={t('total_applicants')}
            footerValue={stats.totalApplicants}
            footerIcon="fas fa-arrow-up"
            footerColor="text-emerald-500"
          />
        </div>

        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title={t('closed_jobs')}
            value={loading ? "..." : stats.closed}
            icon="fas fa-archive"
            color="bg-red-500"
            footer={t('needs_attention')}
            footerIcon="fas fa-exclamation-circle"
            footerColor="text-red-500"
          />
        </div>

        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
            <div 
                className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg cursor-pointer hover:bg-indigo-50 transition transform hover:-translate-y-1"
                onClick={() => history.push('/employer/create-job')}
            >
                <div className="flex-auto p-4 flex items-center justify-center flex-col h-full min-h-[120px]">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-indigo-500 mb-2">
                        <i className="fas fa-plus"></i>
                    </div>
                    <h5 className="text-blueGray-500 uppercase font-bold text-xs">
                        {t('post_new_job')}
                    </h5>
                </div>
            </div>
        </div>
      </div>

      {/* --- PHẦN 2: BẢNG DỮ LIỆU & TIPS --- */}
      <div className="flex flex-wrap mt-4">
        
        {/* LEFT COLUMN: Bài đăng gần đây */}
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            
            {/* Table Header */}
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    {t('recent_job_posts')}
                  </h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <Link
                    to="/employer/my-jobs"
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    {t('view_all')}
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Table Content */}
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      {t('job_title')}
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      {t('status')}
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      {t('posted_date')}
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right">
                      {t('action')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                      <tr><td colSpan="4" className="text-center p-4">{t('loading')}...</td></tr>
                  ) : recentJobs.length === 0 ? (
                      <tr><td colSpan="4" className="text-center p-4 text-sm text-gray-500">{t('no_jobs_found')}</td></tr>
                  ) : (
                      recentJobs.map((job) => (
                        <tr key={job.id}>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-bold text-blueGray-700">
                                {job.title}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <StatusBadge status={job.status} />
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                <Link 
                                    to={`/employer/posts/${job.id}/applications`}
                                    className="text-emerald-600 hover:text-emerald-800 font-bold text-xs border border-emerald-500 px-3 py-1 rounded hover:bg-emerald-50 transition"
                                >
                                    {t('view_candidates')} <i className="fas fa-arrow-right ml-1"></i>
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
        
        {/* RIGHT COLUMN: Tips */}
        <div className="w-full xl:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0 bg-blueGray-50">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    {t('manage_jobs')} & {t('tips')}
                  </h3>
                </div>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-3">
                <Link to="/employer/my-jobs" className="w-full bg-lightBlue-500 text-white font-bold text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-center uppercase">
                    <i className="fas fa-list mr-2"></i> {t('manage_jobs')}
                </Link>

                <div className="mt-4 border-t border-blueGray-100 pt-4">
                   <h6 className="text-blueGray-500 text-xs uppercase font-bold mb-3">{t('tips_for_employer')}</h6>
                   <ul className="list-disc list-inside text-sm text-blueGray-600 space-y-2">
                       <li>{t('tip_update_info')}</li>
                       <li>{t('tip_check_candidates')}</li>
                       <li>{t('tip_use_chat')}</li>
                       <li>{t('tip_close_expired')}</li>
                   </ul>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}