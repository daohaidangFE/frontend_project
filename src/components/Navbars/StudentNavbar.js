// src/components/Navbars/StudentNavbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher.js";
import { useAuth } from "context/AuthContext";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function StudentNavbar() {
  const { t } = useTranslation();
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname.startsWith(path);
    return `
      hover:text-brand text-blueGray-700 px-3 py-4 lg:py-2 flex items-center 
      text-xs uppercase font-bold transition-all duration-150 
      ${isActive ? "text-brand border-b-2 border-brand" : ""}
    `;
  };

  return (
    <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 bg-white shadow">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        {/* --- Logo + toggle --- */}
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Link
            to="/"
            className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
          >
            Internship Hub
          </Link>

          {/* --- Mobile menu button --- */}
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>

        {/* --- Menu --- */}
        <div
          className={
            "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
            (navbarOpen ? " block" : " hidden")
          }
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-2">
            <li className="flex items-center">
              <Link to="/jobs" className={getLinkClass("/jobs")}>
                <i className="fas fa-briefcase text-lg leading-lg mr-2" />{" "}
                {t("jobs", "Jobs")}
              </Link>
            </li>

            <li className="flex items-center">
              <Link
                to="/student/profile"
                className={getLinkClass("/student/profile")}
              >
                <i className="fas fa-user text-lg leading-lg mr-2" />{" "}
                {t("my_profile", "Profile")}
              </Link>
            </li>

            <li className="flex items-center">
              <Link to="/messages" className={getLinkClass("/messages")}>
                <i className="fas fa-envelope text-lg leading-lg mr-2" />{" "}
                {t("messages", "Messages")}
              </Link>
            </li>

            {/* --- Language Switcher --- */}
            <li className="flex items-center">
              <LanguageSwitcher />
            </li>

            {/* --- User Dropdown (nếu đã login) ---
            {isLoggedIn && (
              <li className="flex items-center ml-2">
                <UserDropdown />
              </li>
            )} */}
          </ul>
        </div>
      </div>
    </nav>
  );
}
