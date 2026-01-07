import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/AuthContext";

// Components con
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher.js";

export default function HeaderNavbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const [navbarOpen, setNavbarOpen] = useState(false);

  const getLinkClass = (path) => {
    const isActive = location.pathname.startsWith(path);
    return `hover:text-white hover:opacity-100 px-3 py-2 flex items-center text-xs uppercase font-bold transition-all duration-200 ${
      isActive 
        ? "text-white opacity-100" 
        : "text-white opacity-75"
    }`;
  };

  return (
    <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-indigo-600 shadow-md transition-all duration-300">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Link
            to="/"
            className="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase hover:opacity-90 transition-opacity"
          >
            <i className="fas fa-graduation-cap mr-2 text-lg"></i>
            Internship Hub
          </Link>
          
          <div className="flex items-center lg:hidden">
            <div className="mr-3">
              <LanguageSwitcher />
            </div>

            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block outline-none focus:outline-none text-white opacity-80 hover:opacity-100"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>

        <div
          className={
            "lg:flex flex-grow items-center lg:bg-opacity-0 lg:shadow-none" +
            (navbarOpen ? " block bg-indigo-700 rounded shadow-lg mt-2 p-4 lg:p-0" : " hidden")
          }
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto items-center gap-y-2 lg:gap-y-0">
            
            
            <li className="flex items-center">
              <Link 
                to="/student/jobs"
                className={getLinkClass("/student/jobs")}
              >
                <i className="fas fa-briefcase text-lg leading-lg mr-2" />{" "}
                {t("jobs", "Jobs")}
              </Link>
            </li>

            <li className="flex items-center">
               <Link to="/companies" className={getLinkClass("/companies")}>
                 <i className="fas fa-building text-lg leading-lg mr-2" />{" "}
                 {t("companies", "Companies")}
               </Link>
            </li>

            <li className="hidden lg:flex items-center ml-4">
              <LanguageSwitcher />
            </li>
            {isLoggedIn ? (
              <li className="flex items-center ml-4">
                <UserDropdown />
              </li>
            ) : (
              <>
                <li className="flex items-center ml-4 mt-2 lg:mt-0">
                  <Link to="/auth/login" className="w-full">
                    <button 
                      className="bg-white text-indigo-600 active:bg-blueGray-100 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 w-full lg:w-auto" 
                      type="button"
                    >
                      {t('login_button')}
                    </button>
                  </Link>
                </li>
                <li className="flex items-center ml-2 mt-2 lg:mt-0">
                   <Link to="/auth/register" className="w-full">
                    <button 
                      className="bg-transparent border border-white text-white hover:bg-white hover:text-indigo-600 active:bg-indigo-700 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 w-full lg:w-auto" 
                      type="button"
                    >
                      {t('register_button')}
                    </button>
                   </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}