// src/views/auth/Register.js
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom"; 
import { useTranslation } from "react-i18next"; 
import authService from "services/authService"; 
import { useAuth } from "context/AuthContext"; 

// Role mặc định
const DEFAULT_ROLE = "STUDENT";

export default function Register() { 
  const { t } = useTranslation();
  // Không cần dùng login từ Context, vì ta chuyển hướng về trang Login
  const { login: loginContext } = useAuth(); 
  
  const history = useHistory(); 

  const [formData, setFormData] = useState({
    name: "", // fullName 
    email: "",
    password: "",
    confirmPassword: "",
    role: DEFAULT_ROLE, // 
  });
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); 
    if (error) {
        setError(null); 
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError(t("password_mismatch", "Passwords do not match."));
      setLoading(false);
      return; 
    }
    
    // Data gửi lên Backend (chứa email, password, role, fullName)
    const registerData = {
      email: formData.email,
      password: formData.password,
      role: DEFAULT_ROLE,
      fullName: formData.name,
    };

    try {
      const { user } = await authService.register(registerData);
      loginContext(user); 
      history.push("/");

    } catch (err) {
      console.error("Registration failed:", err);
      // Lấy thông báo lỗi từ response.data.message (cấu trúc ApiResponse) [cite: 603]
      const apiError = err.response?.data?.message ||
        t("register_failed", "Registration failed. Please try again."); 
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 bg-white border-0">
        {/* Header */}
        <div className="rounded-t mb-0 px-6 border-slate-200 text-left">
          <h2 className="text-2xl font-semibold text-slate-700 	text-brand">
            {t("register_title", "Create an Account")}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t("register_subtitle")}
          </p>
        </div>

        <div className="flex-auto px-2 lg:px-10 py-10 pt-6">
          <form onSubmit={handleSubmit}>
            
            {/* Name Input */}
            <div className="flex flex-col mb-5">
              <label className="mb-1 text-xs tracking-wide text-slate-600">{t("name_label", "Full Name")}</label> 
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                  <i className="fas fa-user text-brand"></i>
                </div>
                <input
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password} 
                  onChange={handleChange}
                  className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  placeholder={t("password_placeholder")}
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs tracking-wide text-slate-600">{t("confirm_password_label")}</label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-slate-400">
                  <i className="fas fa-lock text-brand"></i> 
                </div>
                <input
                  type="password"
                  name="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="text-sm placeholder-slate-400 pl-10 pr-4 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  placeholder={t("confirm_password_placeholder")}
                  required 
                />
              </div>
            </div>
            
            {/* Error Message Display */}
            {error && (
              <div className="text-red-500 text-sm text-center mb-4">{error}</div> 
            )}

            {/* Submit button */}
            <div className="text-center mt-6">
              <button
                className="bg-brand hover:opacity-90 w-full py-3 font-bold text-white uppercase text-sm rounded-lg shadow hover:shadow-md transition-all duration-150"
                type="submit" 
                disabled={loading}
              >
                {loading ? t("loading", "Loading...") : t('register_button')} 
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