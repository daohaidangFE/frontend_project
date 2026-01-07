import React from "react";
import { Link } from "react-router-dom";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const { t } = useTranslation();

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          
          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/admin/dashboard"
          >
            Internship Hub
          </Link>

          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>

          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/admin/dashboard"
                  >
                    Internship Hub
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              {t('admin_section')}
            </h6>

            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              
              {/* --- 0. DASHBOARD (MỚI THÊM) --- */}
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/dashboard") !== -1
                      ? "text-lightBlue-500 hover:opacity-80"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/dashboard"
                >
                  <i
                    className={
                      "fas fa-tv mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/dashboard") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  {t('dashboard') || "Dashboard"}
                </Link>
              </li>

              {/* 1. Quản lý Người dùng */}
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/users") !== -1
                      ? "text-lightBlue-500 hover:opacity-80"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/users"
                >
                  <i
                    className={
                      "fas fa-users mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/users") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  {t('manage_users')}
                </Link>
              </li>

              {/* 2. Quản lý Tin tuyển dụng */}
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/job-posts") !== -1
                      ? "text-lightBlue-500 hover:opacity-80"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/job-posts"
                >
                  <i
                    className={
                      "fas fa-briefcase mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/job-posts") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  {t('manage_job_posts')}
                </Link>
              </li>

              {/* 3. Phê duyệt bài đăng */}
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/job-approval") !== -1
                      ? "text-lightBlue-500 hover:opacity-80"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/job-approval"
                >
                  <i
                    className={
                      "fas fa-check-circle mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/job-approval") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  {t('approve_job_posts')}
                </Link>
              </li>

              {/* 4. Quản lý Kỹ năng */}
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/skills") !== -1
                      ? "text-lightBlue-500 hover:opacity-80"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/skills"
                >
                  <i
                    className={
                      "fas fa-laptop-code mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/skills") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  {t('manage_skills')}
                </Link>
              </li>
            </ul>

            {/* Divider ngăn cách phần Settings */}
            <hr className="my-4 md:min-w-full" />
            
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              {t('settings_section') || "Cấu hình"}
            </h6>

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              {/* --- 5. SETTINGS */}
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/settings") !== -1
                      ? "text-lightBlue-500 hover:opacity-80"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/settings"
                >
                  <i
                    className={
                      "fas fa-cogs mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/settings") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  {t('settings')}
                </Link>
              </li>
            </ul>

          </div>
        </div>
      </nav>
    </>
  );
}