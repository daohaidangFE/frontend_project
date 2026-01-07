import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EmployerDashboard() {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-wrap">
        {/* CARD 1: Active Jobs */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title={t('active_jobs')}
            value="3"
            icon="fas fa-briefcase"
            color="bg-emerald-500"
            footer={t('pending_jobs_count')}
            footerIcon="fas fa-clock"
            footerColor="text-orange-500"
          />
        </div>

        {/* CARD 2: New Candidates */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title={t('new_candidates')}
            value="12"
            icon="fas fa-users"
            color="bg-lightBlue-500"
            footer={t('increase_since_last_week')}
            footerIcon="fas fa-arrow-up"
            footerColor="text-emerald-500"
          />
        </div>

        {/* CARD 3: Expiring Soon */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title={t('expiring_soon')}
            value="1"
            icon="fas fa-hourglass-half"
            color="bg-orange-500"
            footer={t('expires_in_days')}
            footerIcon="fas fa-exclamation-triangle"
            footerColor="text-red-500"
          />
        </div>

        {/* CARD 4: Total Views */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title={t('total_views')}
            value="450"
            icon="fas fa-chart-bar"
            color="bg-red-500"
            footer={t('updated_ago')}
            footerIcon="fas fa-sync"
            footerColor="text-blueGray-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap mt-4">
        {/* LEFT COLUMN: Recent Candidates */}
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    {t('newly_applied_candidates')}
                  </h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <Link
                    to="/employer/dashboard"
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    {t('view_all')}
                  </Link>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto">
              {/* Short Candidates Table */}
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      {t('candidate_name')}
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      {t('applied_position')}
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      {t('applied_date')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      Nguyễn Văn A
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      Frontend Intern
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {t('just_now')}
                    </td>
                  </tr>
                  <tr>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      Trần Thị B
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      Java Backend
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {t('hours_ago')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* RIGHT COLUMN: Shortcuts */}
        <div className="w-full xl:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    {t('shortcuts')}
                  </h3>
                </div>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-3">
                <Link to="/employer/create-job" className="w-full bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-center uppercase">
                    <i className="fas fa-plus-circle mr-2"></i> {t('post_new_job')}
                </Link>
                <Link to="/employer/my-jobs" className="w-full bg-lightBlue-500 text-white font-bold text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-center uppercase">
                    <i className="fas fa-list mr-2"></i> {t('manage_jobs')}
                </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Sub-component for Stat Card
function StatCard({ title, value, icon, color, footer, footerIcon, footerColor }) {
    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                    {title}
                  </h5>
                  <span className="font-semibold text-xl text-blueGray-700">
                    {value}
                  </span>
                </div>
                <div className="relative w-auto pl-4 flex-initial">
                  <div
                    className={
                      "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " +
                      color
                    }
                  >
                    <i className={icon}></i>
                  </div>
                </div>
              </div>
              <p className="text-sm text-blueGray-400 mt-4">
                <span className={footerColor + " mr-2"}>
                  <i className={footerIcon}></i> {footer}
                </span>
              </p>
            </div>
          </div>
    )
}