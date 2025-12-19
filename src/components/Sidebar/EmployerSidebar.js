import React from "react";
import { Link, useLocation } from "react-router-dom";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { useTranslation } from "react-i18next";

export default function EmployerSidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const location = useLocation();
  const { t } = useTranslation();

  // Hàm kiểm tra active link
  const isActive = (path) => {
      return location.pathname.indexOf(path) !== -1
          ? "text-brand hover:text-emerald-600"
          : "text-blueGray-700 hover:text-blueGray-500";
  };

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
            to="/employer/dashboard"
          >
            Employer Portal
          </Link>
          
          {/* User (Mobile) */}
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
                  <Link className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0" to="/">
                    Internship Hub
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button type="button" className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent" onClick={() => setCollapseShow("hidden")}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <hr className="my-4 md:min-w-full" />
            
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {/* Menu: Đăng tin mới */}
              <li className="items-center">
                <Link className={"text-xs uppercase py-3 font-bold block " + isActive("/employer/create-job")} to="/employer/create-job">
                  <i className="fas fa-plus-circle mr-2 text-sm opacity-75"></i>{" "}
                  {t('post_new_job', "Đăng tin tuyển dụng")}
                </Link>
              </li>

              {/* Menu: Quản lý tin */}
              <li className="items-center">
                <Link className={"text-xs uppercase py-3 font-bold block " + isActive("/employer/jobs")} to="/employer/jobs">
                  <i className="fas fa-list-alt mr-2 text-sm opacity-75"></i>{" "}
                  {t('manage_my_jobs', "Quản lý tin đăng")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}