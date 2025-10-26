// src/views/auth/ForgotPassword.js
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
    const { t } = useTranslation();
    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 bg-white border-0">
                {/* Header */}
                <div className="rounded-t px-6 border-slate-200 text-left">
                    <h2 className="text-2xl font-semibold text-slate-700  text-brand">
                        {t("forgot_password")}
                    </h2>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-6">
                    <form>
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
                        {/* Submit button */}
                        <div className="text-center mt-6">
                            <button
                                className="bg-brand hover:opacity-90 w-full py-3 font-bold text-white uppercase text-sm rounded-lg shadow hover:shadow-md transition-all duration-150"
                                type="button"
                            >
                                {t('reset_password')}
                            </button>
                        </div>
                        <div className="flex justify-between mt-6">
                            <div className="">
                                <Link to="/auth/login" className="text-sm text-slate-500  text-brand hover:opacity-80">
                                    {t("back_to_login")}
                                </Link>
                            </div>
                            <div className="">
                                <Link to="/auth/register" className="text-sm text-slate-500  text-brand hover:opacity-80">
                                    {t("register_a_new_account")}
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/* Footer */}
            <div className="text-center mt-auto">
                <p className="text-sm font-semibold text-slate-700">
                    {t("troll")}
                </p>
            </div>
        </>
    );
}