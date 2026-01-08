import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/AuthContext";
import profileService from "services/profileService";

export default function EmployerSidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [hasCompany, setHasCompany] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // 1. Tách hàm fetch ra và dùng useCallback để không bị tạo lại mỗi lần render
  const checkCompanyStatus = useCallback(async () => {
    if (user && user.role === "EMPLOYER") {
      try {
        const profile = await profileService.getMyEmployerProfile();
        
        // Kiểm tra kỹ cả object company hoặc companyId
        if (profile && (profile.company || profile.companyId)) {
          setHasCompany(true);
        } else {
          setHasCompany(false);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin Employer:", error);
        setHasCompany(false); 
      } finally {
        setLoadingProfile(false);
      }
    } else {
      setLoadingProfile(false);
    }
  }, [user]);

  // 2. useEffect: Vừa gọi lúc đầu, vừa lắng nghe sự kiện từ Onboarding
  useEffect(() => {
    // Gọi ngay lần đầu tiên
    checkCompanyStatus();

    // Định nghĩa hàm xử lý khi có sự kiện update
    const handleCompanyUpdate = () => {
      console.log("Sidebar: Nhận tín hiệu cập nhật công ty -> Fetch lại profile");
      setLoadingProfile(true); // Set loading để user thấy phản hồi
      checkCompanyStatus();
    };

    // Đăng ký lắng nghe sự kiện "COMPANY_UPDATED"
    window.addEventListener("COMPANY_UPDATED", handleCompanyUpdate);

    // Dọn dẹp listener khi component bị hủy
    return () => {
      window.removeEventListener("COMPANY_UPDATED", handleCompanyUpdate);
    };
  }, [checkCompanyStatus]);

  const isLocked = !loadingProfile && !hasCompany;

  const lockedClass = (isLocked || loadingProfile)
    ? "opacity-50 pointer-events-none select-none filter grayscale cursor-not-allowed" 
    : "";

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path)
      ? "text-emerald-500 hover:text-emerald-600"
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

          {/* Brand - KHÔNG KHÓA */}
          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/employer/dashboard"
          >
            {t("employer_portal")}
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
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    {t("site_name")}
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

            <hr className="my-4 md:min-w-full" />

            {/* --- KHU VỰC MENU BỊ KHÓA --- */}
            <div className="relative">
              {/* Tooltip thông báo - Chỉ hiện khi load xong mà vẫn bị khóa */}
              {isLocked && (
                <div className="md:block hidden absolute top-0 left-0 right-0 z-50 text-center mt-10">
                   <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded border border-red-200 shadow-sm whitespace-nowrap">
                    <i className="fas fa-lock mr-1"></i> {t('complete_profile_first', "Cần tham gia công ty")}
                  </span>
                </div>
              )}

              <ul className={`md:flex-col md:min-w-full flex flex-col list-none transition-all duration-300 ${lockedClass}`}>
                {/* Menu: Dashboard */}
                <li className="items-center">
                  <Link
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      isActive("/employer/dashboard")
                    }
                    to="/employer/dashboard"
                    // Chặn click bằng JS
                    onClick={(e) => (isLocked || loadingProfile) && e.preventDefault()}
                  >
                    <i
                      className={
                        "fas fa-tv mr-2 text-sm " +
                        (location.pathname === "/employer/dashboard"
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    {t("dashboard")}
                  </Link>
                </li>

                {/* Menu: Đăng tin mới */}
                <li className="items-center">
                  <Link
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      isActive("/employer/create-job")
                    }
                    to="/employer/create-job"
                    onClick={(e) => (isLocked || loadingProfile) && e.preventDefault()}
                  >
                    <i
                      className={
                        "fas fa-plus-circle mr-2 text-sm " +
                        (location.pathname.startsWith("/employer/create-job")
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    {t("post_new_job")}
                  </Link>
                </li>

                {/* Menu: Quản lý tin */}
                <li className="items-center">
                  <Link
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      isActive("/employer/my-jobs")
                    }
                    to="/employer/my-jobs"
                    onClick={(e) => (isLocked || loadingProfile) && e.preventDefault()}
                  >
                    <i
                      className={
                        "fas fa-list-alt mr-2 text-sm " +
                        (location.pathname.startsWith("/employer/my-jobs")
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    {t("manage_my_jobs")}
                  </Link>
                </li>
                
                <li className="items-center">
                  <Link
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      isActive("/employer/profile")
                    }
                    to="/employer/profile"
                    onClick={(e) => (isLocked || loadingProfile) && e.preventDefault()}
                  >
                    <i
                      className={
                        "fas fa-user-cog mr-2 text-sm " +
                        (location.pathname.startsWith("/employer/profile")
                          ? "opacity-75"
                          : "text-blueGray-300")
                      }
                    ></i>{" "}
                    {t("profile_settings", "Thiết lập hồ sơ")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}