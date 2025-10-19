// src/components/Dropdowns/UserDropdown.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/AuthContext";

const UserDropdown = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ... Nút bấm chính giữ nguyên ... */}
      <button
        className="text-blueGray-700 hover:text-blueGray-500 
        px-3 py-2 flex items-center text-xs uppercase font-bold transition-colors duration-300"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {user.name}
        <i className="fas fa-caret-down ml-2"></i>
      </button>
      
      {dropdownOpen && (
        // SỬA Ở DÒNG DƯỚI ĐÂY
        <div className="absolute top-full right-0 mt-2 py-2
         bg-white rounded-md shadow-xl z-50 min-w-max whitespace-nowrap">
          <Link
            to="/student/profile"
            className="flex items-center px-4 py-2 text-sm
             text-blueGray-700 hover:bg-blueGray-100 transition-colors duration-300"
            onClick={() => setDropdownOpen(false)}
          >
            <i className="fas fa-user-circle mr-2 w-4"></i>
            {t('my_profile')}
          </Link>
          
          <div className="border-t border-blueGray-100 my-1"></div>
          
          <button
            className="flex items-center w-full text-left 
            px-4 py-2 text-sm text-blueGray-700 hover:bg-blueGray-100 transition-colors duration-300"
            onClick={() => {
              logout();
              setDropdownOpen(false);
            }}
          >
            <i className="fas fa-sign-out-alt mr-2 w-4"></i>
            {t('logout_button')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;