import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/AuthContext";
import authService from "services/authService";

// Import ảnh ở đầu file cho chuẩn React
import googleIcon from "assets/img/google.svg"; 

export default function Login() {
  const { t } = useTranslation();
  const { login: loginContext } = useAuth();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State cho nút ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await authService.login(email, password);
      if (loginContext) loginContext(user);

      const role = user.role?.toUpperCase() || "";
      if (role === "ADMIN" || role === "SYSTEM_ADMIN") {
        history.push("/admin/dashboard");
      } else if (role === "EMPLOYER") {
        history.push("/employer/dashboard");
      } else {
        history.push("/student/profile");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || t("login_error_general", "Login failed.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col w-full mb-6 bg-white rounded-lg shadow-md">
        <div className="px-6 text-left">
          <h2 className="text-2xl font-semibold text-brand mt-4">
            {t("login_title")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("login_subtitle")}
          </p>
        </div>

        <div className="px-4 lg:px-10 py-10 pt-6">
          <form onSubmit={handleLogin}>
            {error && (
              <div className="flex items-center text-red-500 bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4 text-sm">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>{error}</span>
              </div>
            )}

            {/* --- EMAIL --- */}
            <div className="mb-5">
              <label 
                htmlFor="email" // FIX: Link với ID input
                className="block mb-2 text-xs font-bold text-slate-600 uppercase"
              >
                {t("email_label")}
              </label>
              <input
                id="email" // FIX: Thêm ID
                type="email"
                className="w-full px-4 py-3 text-sm border rounded-lg shadow focus:outline-none focus:ring-1 focus:ring-brand ease-linear transition-all duration-150"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                autoFocus
              />
            </div>

            {/* --- PASSWORD --- */}
            <div className="mb-6 relative">
              <label 
                htmlFor="password" // FIX: Link với ID input
                className="block mb-2 text-xs font-bold text-slate-600 uppercase"
              >
                {t("password_label")}
              </label>
              <div className="relative">
                <input
                    id="password" // FIX: Thêm ID
                    type={showPassword ? "text" : "password"} // Logic ẩn hiện
                    className="w-full px-4 py-3 text-sm border rounded-lg shadow focus:outline-none focus:ring-1 focus:ring-brand ease-linear transition-all duration-150 pr-10" // pr-10 để chữ không đè lên icon mắt
                    placeholder="******"
                    value={password}
                    onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    }}
                    required
                />
                {/* Nút con mắt */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            <div className="text-right mb-4">
              <Link
                to="/auth/forgotpassword"
                className="text-sm font-semibold text-brand hover:opacity-80"
              >
                {t("forgot_password")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 text-sm font-bold uppercase text-white rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-brand hover:bg-brand-dark"
              }`}
            >
              {loading ? (
                  <span><i className="fas fa-spinner fa-spin mr-2"></i> {t("logging_in")}</span>
              ) : t("login_button")}
            </button>

            <p className="text-center my-4 text-slate-500 text-sm">{t("or_login_with")}</p>
            
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 rounded-lg py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:shadow hover:bg-slate-50 transition-all"
            >
              <img
                alt="Google"
                className="w-5 h-5"
                src={googleIcon}
              />
              {t("register_with_google")}
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-wrap mt-6 relative">
        <div className="w-full text-center">
            <p className="text-blueGray-500">
                <span className="text-sm text-slate-500 mr-1">{t("no_account_yet")}</span>
                <Link
                    to="/auth/register"
                    className="font-bold text-brand hover:underline"
                >
                    {t("register_now")}
                </Link>
            </p>
        </div>
      </div>
    </>
  );
}