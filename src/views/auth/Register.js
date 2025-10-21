// src/views/auth/Register.js
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t } = useTranslation();
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
        {/* Header */}
        <div className="rounded-t mb-0 px-6 border-slate-200 text-left">
          <h2 className="text-2xl font-semibold text-slate-700  text-brand">
            {t("register_title", "Create an Account")}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t("register_subtitle")}
          </p>
        </div>

        <div className="flex-auto px-2 lg:px-10 py-10 pt-6">
          <form>
            {/* Name Input */}
            <div className="flex flex-col mb-5">
                <label className="mb-1 text-xs tracking-wide text-slate-600">{t("name_label", "Name")}</label>
                <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                        <i className="fas fa-user text-brand"></i>
                    </div>
                    <input
                        type="text"
                        className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        placeholder={t("name_placeholder", "Your full name")}
                        required
                    />
                </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col mb-5">
                <label className="mb-1 text-xs tracking-wide text-slate-600">{t("email_label")}</label>
                <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                        <i className="fas fa-envelope text-brand"></i>
                    </div>
                    <input
                        type="email"
                        className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        placeholder={t("email_placeholder")}
                        required
                    />
                </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col mb-5">
                <label className="mb-1 text-xs tracking-wide text-slate-600">{t("password_label")}</label>
                <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                        <i className="fas fa-lock text-brand"></i>
                    </div>
                    <input
                        type="password"
                        className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        placeholder={t("password_placeholder")}
                        required
                    />
                </div>
            </div>

            {/* === KHỐI MÃ MỚI BẮT ĐẦU TỪ ĐÂY === */}
            {/* Confirm Password Input */}
            <div className="flex flex-col mb-6">
                <label className="mb-1 text-xs tracking-wide text-slate-600">{t("confirm_password_label")}</label>
                <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                        <i className="fas fa-lock text-brand"></i>
                    </div>
                    <input
                        type="password"
                        className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        placeholder={t("confirm_password_placeholder")}
                        required
                    />
                </div>
            </div>
            {/* === KHỐI MÃ MỚI KẾT THÚC TẠI ĐÂY === */}


            {/* Submit button */}
            <div className="text-center mt-6">
                <button
                    className="bg-brand hover:opacity-90 w-full py-3 font-bold text-white uppercase text-sm rounded-lg shadow hover:shadow-md transition-all duration-150"
                    type="button"
                >
                    {t('register_button')}
                </button>
            </div>
            <p className="text-center my-4">{t("or_login_with")}</p>
            <div className="text-center">
            <button
                className="bg-white active:bg-slate-50 text-slate-700 font-normal 
                px-4 py-2 rounded-lg outline-none focus:outline-none border 
                border-slate-300 hover:shadow-md inline-flex items-center 
                font-bold text-xs ease-linear transition-all duration-150"
                type="button"
            >
                <img
                    alt="..."
                    className="w-5 mr-2"
                    src={require("assets/img/google.svg").default}
                />
                {t("register_with_google")}
            </button>
            </div>
        </form>
        </div>
      </div>
      {/* Footer */}
      <div className="text-center mt-auto">
        <p className="text-sm text-slate-500">
          {t("already_have_account", "Already have an account?")}{" "}
          <Link to="/auth/login" className="font-semibold text-brand hover:opacity-80">
            {t("login_now", "Log In")}
          </Link>
        </p>
      </div>
    </>
  );
}