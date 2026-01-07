import React from "react";
import { useLocation } from "react-router-dom";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher.js";

export default function Navbar() {
  const location = useLocation();

  const getPageName = () => {
    const path = location.pathname.split("/").pop();
    return path ? path.toUpperCase() : "DASHBOARD";
  };

  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          
          <div className="w-full md:w-1/3">
            <a
              className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              {getPageName()}
            </a>
            
            <div className="hidden lg:flex text-white opacity-80 text-xs mt-1">
                <span className="font-bold">ADMIN</span>
                <span className="mx-2">/</span>
                <span className="font-bold">{getPageName()}</span>
            </div>
          </div>

          <ul className="flex-col md:flex-row list-none items-center hidden md:flex gap-4">
            
            <li className="flex items-center text-white opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
               <LanguageSwitcher />
            </li>

            <li className="flex items-center">
              <UserDropdown />
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}