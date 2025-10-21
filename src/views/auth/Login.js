// src/views/auth/Login.js
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/AuthContext";
import authService from "services/authService";

export default function Login() {
  const { t } = useTranslation();
  const { login: loginContext } = useAuth();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const { user, token } = response.data;
      localStorage.setItem("jwt_token", token);
      loginContext(user);

      if (user.role === "student") history.push("/student/dashboard");
      else if (user.role === "employer") history.push("/employer/dashboard");
      else history.push("/");
    } catch (err) {
      setError(t("login_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 h-full bg-slate-50">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-5/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
            {/* Header */}
            <div className="rounded-t mb-0 px-6 py-4 border-b border-slate-200 text-left">
              <h2 className="text-2xl font-semibold text-slate-700  text-brand">
                {t("login_title")}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {t("login_subtitle")}
              </p>
            </div>

            {/* Body */}
            <div className="flex-auto px-4 lg:px-10 py-10 pt-6">
              <form onSubmit={handleLogin}>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required autoFocus
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col mb-6">
                  <label className="mb-1 text-xs tracking-wide text-slate-600">{t("password_label")}</label>
                  <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                      <i className="fas fa-lock text-brand"></i>
                    </div>
                    <input
                      type="password"
                      className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                      placeholder={t("password_placeholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-center my-3 font-bold">
                    <small>{error}</small>
                  </div>
                )}
                <div className="text-right">
                  <Link to="/auth/forgotpassword" className="text-sm text-slate-500  text-brand hover:opacity-80">
                    {t("forgot_password")}
                  </Link>  
                </div>
                {/* Submit button */}
                <div className="text-center mt-6">
                  <button
                    className={`w-full py-3 font-bold text-white uppercase text-sm rounded-lg shadow hover:shadow-md transition-all duration-150 ${
                      loading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-brand hover:opacity-90"
                    }`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? t("logging_in") : t("login_button")}
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
          <div className="text-center mb-6">
            <p className="text-sm text-slate-500">
              {t("no_account_yet")}{" "}
              <Link to="/auth/register" className="font-semibold text-brand hover:opacity-80">
                {t("register_now")}
              </Link>
            </p>           
          </div>
        </div>
      </div>
    </div>
  );
}