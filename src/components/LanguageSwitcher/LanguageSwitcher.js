import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language; // 'vi' hoặc 'en'

  return (
    <div className="inline-flex items-center bg-indigo-500 rounded-full px-1 py-1 shadow-inner">
      {/* Nút Tiếng Việt */}
      <button
        onClick={() => changeLanguage("vi")}
        className={`px-2 py-1 text-xs font-bold rounded-full transition-all duration-200 focus:outline-none ${
          currentLang === "vi"
            ? "bg-white text-indigo-700 shadow"
            : "text-indigo-200 hover:text-white"
        }`}
      >
        VI
      </button>

      {/* Nút Tiếng Anh */}
      <button
        onClick={() => changeLanguage("en")}
        className={`px-2 py-1 text-xs font-bold rounded-full transition-all duration-200 focus:outline-none ${
          currentLang === "en"
            ? "bg-white text-indigo-700 shadow"
            : "text-indigo-200 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}