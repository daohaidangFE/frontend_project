import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t } = useTranslation();

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 bg-white border-0 rounded-lg shadow-md">
        {/* Header */}
        <div className="rounded-t px-6 py-4 border-b border-slate-100 text-left">
          <h2 className="text-2xl font-semibold text-blueGray-700">
            {t("forgot_password")}
          </h2>
        </div>
        
        <div className="flex-auto px-4 lg:px-10 py-10 pt-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col mb-5">
              <label className="mb-1 text-xs font-bold tracking-wide text-blueGray-600 uppercase">
                {t("email_label")}
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-blueGray-300">
                  <i className="fas fa-envelope"></i>
                </div>
                <input
                  type="email"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full ease-linear transition-all duration-150 pl-10"
                  placeholder={t("email_placeholder")}
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="text-center mt-6">
              <button
                className="bg-indigo-600 text-white active:bg-indigo-700 hover:shadow-lg w-full py-3 font-bold uppercase text-sm rounded shadow outline-none focus:outline-none transition-all duration-150"
                type="submit"
              >
                {t('reset_password')}
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-between mt-6">
              <div className="w-1/2">
                <Link to="/auth/login" className="text-sm text-blueGray-500 hover:text-indigo-500 transition-colors">
                  {t("back_to_login")}
                </Link>
              </div>
              <div className="w-1/2 text-right">
                <Link to="/auth/register" className="text-sm text-blueGray-500 hover:text-indigo-500 transition-colors">
                  {t("register_a_new_account")}
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer / Quote */}
      <div className="text-center mt-auto pb-6">
        <p className="text-sm font-semibold text-blueGray-500">
          {t("troll")}
        </p>
      </div>
    </>
  );
}