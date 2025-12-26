import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "services/authService";
import { useAuth } from "context/AuthContext";
import googleIcon from "assets/img/google.svg"; 

export default function Register() {
  const { t } = useTranslation();
  const { login: loginContext } = useAuth();
  const history = useHistory();

  // State
  const [role, setRole] = useState("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State UI
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError(t("error_must_agree_terms", "Bạn phải đồng ý với điều khoản dịch vụ."));
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        fullName: name,
        email: email,
        password: password,
        role: role,
      };

      const { user } = await authService.register(registerData);
      
      if (loginContext) loginContext(user);

      if (user.role === "EMPLOYER") {
        history.push("/employer/dashboard");
      } else {
        history.push("/student/profile");
      }

    } catch (err) {
      console.error("Register failed:", err);
      setError(err.response?.data?.message || t("register_error_general", "Đăng ký thất bại."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col w-full mb-6 bg-white rounded-lg shadow-md">
        {/* Header giống hệt Login */}
        <div className="px-6 text-left">
          <h2 className="text-2xl font-semibold text-brand mt-4">
            {t("register_title", "Tạo tài khoản")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("register_subtitle", "Nhập thông tin đăng ký")}
          </p>
        </div>

        <div className="px-4 lg:px-10 py-10 pt-6">
          <form onSubmit={handleRegister}>
            {error && (
              <div className="flex items-center text-red-500 bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4 text-sm">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>{error}</span>
              </div>
            )}

            {/* --- NAME --- */}
            <div className="mb-5">
              <label 
                htmlFor="name"
                className="block mb-2 text-xs font-bold text-slate-600 uppercase"
              >
                {t("name_label", "Họ và tên")}
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 text-sm border rounded-lg shadow focus:outline-none focus:ring-1 focus:ring-brand ease-linear transition-all duration-150"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* --- EMAIL --- */}
            <div className="mb-5">
              <label 
                htmlFor="email"
                className="block mb-2 text-xs font-bold text-slate-600 uppercase"
              >
                {t("email_label")}
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 text-sm border rounded-lg shadow focus:outline-none focus:ring-1 focus:ring-brand ease-linear transition-all duration-150"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* --- PASSWORD --- */}
            <div className="mb-5 relative">
              <label 
                htmlFor="password"
                className="block mb-2 text-xs font-bold text-slate-600 uppercase"
              >
                {t("password_label")}
              </label>
              <div className="relative">
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 text-sm border rounded-lg shadow focus:outline-none focus:ring-1 focus:ring-brand ease-linear transition-all duration-150 pr-10"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            {/* --- ROLE SELECTION --- */}
            <div className="mb-6">
               <label className="block mb-2 text-xs font-bold text-slate-600 uppercase">
                 {t("role_label", "Bạn là ai?")}
               </label>
               <div className="flex gap-4">
                  {/* Student Option */}
                  <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-all ${role === 'STUDENT' ? 'border-brand bg-indigo-50 text-brand shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="STUDENT"
                        checked={role === 'STUDENT'}
                        onChange={(e) => setRole(e.target.value)}
                        className="hidden" 
                      />
                      <i className="fas fa-user-graduate mr-2"></i>
                      <span className="font-semibold text-sm">Sinh viên</span>
                  </label>

                  {/* Employer Option */}
                  <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-all ${role === 'EMPLOYER' ? 'border-brand bg-indigo-50 text-brand shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="EMPLOYER"
                        checked={role === 'EMPLOYER'}
                        onChange={(e) => setRole(e.target.value)}
                        className="hidden" 
                      />
                      <i className="fas fa-building mr-2"></i>
                      <span className="font-semibold text-sm">Nhà tuyển dụng</span>
                  </label>
               </div>
            </div>

            {/* --- TERMS CHECKBOX --- */}
            <div className="mb-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  id="customCheckLogin"
                  type="checkbox"
                  className="form-checkbox border-0 rounded text-brand ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="ml-2 text-sm font-semibold text-slate-600">
                  {t("i_agree_with", "Tôi đồng ý với")}{" "}
                  <a href="#pablo" onClick={e => e.preventDefault()} className="text-brand hover:underline">
                    {t("privacy_policy", "Chính sách bảo mật")}
                  </a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 text-sm font-bold uppercase text-white rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-brand hover:bg-brand-dark"
              }`}
            >
              {loading ? (
                  <span><i className="fas fa-spinner fa-spin mr-2"></i> {t("processing", "Đang xử lý...")}</span>
              ) : t("register_button", "Đăng ký ngay")}
            </button>

            {/* Social Login */}
            <p className="text-center my-4 text-slate-500 text-sm">{t("or_register_with", "Hoặc đăng ký bằng")}</p>
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

      {/* Footer Link (Login) - Đồng bộ style với Login của bạn */}
      <div className="flex flex-wrap mt-6 relative">
        <div className="w-full text-center">
            <p className="text-blueGray-500">
                <span className="text-sm text-slate-500 mr-1">{t("already_have_account", "Đã có tài khoản?")}</span>
                <Link
                    to="/auth/login"
                    className="font-bold text-brand hover:underline"
                >
                    {t("login_now", "Đăng nhập")}
                </Link>
            </p>
        </div>
      </div>
    </>
  );
}