import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "services/authService";
import { useAuth } from "context/AuthContext";

export default function Register() {
  const { t } = useTranslation();
  const { login: loginContext } = useAuth();
  const history = useHistory();

  const [role, setRole] = useState("STUDENT");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError(t("password_mismatch"));
      setLoading(false);
      return;
    }

    const registerData = {
      email: formData.email,
      password: formData.password,
      role: role,
      fullName: formData.name,
    };

    try {
      const { user } = await authService.register(registerData);
      loginContext(user);

      if (user.role === "EMPLOYER") {
        history.push("/employer/jobs");
      } else {
        history.push("/");
      }
    } catch (err) {
      const apiError = err.response?.data?.message || t("register_failed");
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 bg-white border-0 rounded-lg shadow-md">
        <div className="rounded-t mb-0 px-6 border-slate-200 text-left">
          <h2 className="text-2xl font-semibold text-slate-700 text-brand">
            {t("register_title")}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t("register_subtitle")}
          </p>
        </div>

        <div className="flex-auto px-4 lg:px-10 py-10 pt-6">
          <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-6">
                <div className="bg-blueGray-100 p-1 rounded-lg inline-flex cursor-pointer shadow-inner"> 
                    <div 
                        onClick={() => setRole("STUDENT")}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-200 flex items-center whitespace-nowrap ${
                            role === "STUDENT" 
                            ? "bg-white text-brand shadow" 
                            : "text-blueGray-500 hover:text-blueGray-700"
                        }`}
                    >
                        <i className="fas fa-user-graduate mr-2"></i>
                        {t('role_student')}
                    </div>
                    <div 
                        onClick={() => setRole("EMPLOYER")}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-200 flex items-center whitespace-nowrap ${
                            role === "EMPLOYER" 
                            ? "bg-white text-brand shadow" 
                            : "text-blueGray-500 hover:text-blueGray-700"
                        }`}
                    >
                        <i className="fas fa-briefcase mr-2"></i>
                        {t('role_employer')}
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-5">
              <label className="mb-1 text-xs tracking-wide text-slate-600">
                {t("name_label")}
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                  <i className="fas fa-user text-brand"></i>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mb-5">
              <label className="mb-1 text-xs tracking-wide text-slate-600">
                {t("email_label")}
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                  <i className="fas fa-envelope text-brand"></i>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mb-5">
              <label className="mb-1 text-xs tracking-wide text-slate-600">
                {t("password_label")}
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                  <i className="fas fa-lock text-brand"></i>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs tracking-wide text-slate-600">
                {t("confirm_password_label")}
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                  <i className="fas fa-lock text-brand"></i>
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center mb-4 bg-red-50 p-2 rounded border border-red-200">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {error}
              </div>
            )}

            <div className="text-center mt-6">
              <button
                className="bg-brand hover:opacity-90 w-full py-3 font-bold text-white uppercase text-sm rounded-lg shadow hover:shadow-md transition-all duration-150 flex justify-center items-center gap-2"
                type="submit"
                disabled={loading}
              >
                {loading && <i className="fas fa-spinner fa-spin"></i>}
                {loading ? t("loading") : t("register_button")}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="text-center mt-auto">
        <p className="text-sm text-slate-500">
          {t("already_have_account")}{" "}
          <Link to="/auth/login" className="font-semibold text-brand hover:opacity-80">
            {t("login_now")}
          </Link>
        </p>
      </div>
    </>
  );
}
