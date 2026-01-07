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
      setError(t("error_must_agree_terms"));
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
      setError(err.response?.data?.message || t("register_error_general"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col w-full mb-6 bg-white rounded-lg shadow-md border-0">
        <div className="rounded-t mb-0 px-6 py-6">
          <div className="text-center mb-3">
            <h6 className="text-blueGray-500 text-sm font-bold">
              {t("register_title")}
            </h6>
          </div>
          <div className="text-center">
             <p className="text-blueGray-400 text-sm">
                {t("register_subtitle")}
             </p>
          </div>
          <hr className="mt-6 border-b-1 border-blueGray-300" />
        </div>

        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form onSubmit={handleRegister}>
            {error && (
              <div className="flex items-center text-red-500 bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4 text-sm">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span>{error}</span>
              </div>
            )}

            {/* --- NAME --- */}
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                {t("name_label")}
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full ease-linear transition-all duration-150"
                placeholder="Nguyen Van A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* --- EMAIL --- */}
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                {t("email_label")}
              </label>
              <input
                type="email"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full ease-linear transition-all duration-150"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* --- PASSWORD --- */}
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                {t("password_label")}
              </label>
              <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full ease-linear transition-all duration-150 pr-10"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blueGray-400 hover:text-indigo-500 focus:outline-none"
                >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>

            {/* --- ROLE SELECTION --- */}
            <div className="mb-6">
               <label className="block mb-2 text-xs font-bold text-blueGray-600 uppercase">
                 {t("role_label")}
               </label>
               <div className="flex gap-4">
                  {/* Student Option */}
                  <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-all ${role === 'STUDENT' ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-blueGray-200 hover:bg-blueGray-50'}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="STUDENT"
                        checked={role === 'STUDENT'}
                        onChange={(e) => setRole(e.target.value)}
                        className="hidden" 
                      />
                      <i className="fas fa-user-graduate mr-2"></i>
                      <span className="font-semibold text-sm">{t("role_student")}</span>
                  </label>

                  {/* Employer Option */}
                  <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center transition-all ${role === 'EMPLOYER' ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-blueGray-200 hover:bg-blueGray-50'}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="EMPLOYER"
                        checked={role === 'EMPLOYER'}
                        onChange={(e) => setRole(e.target.value)}
                        className="hidden" 
                      />
                      <i className="fas fa-building mr-2"></i>
                      <span className="font-semibold text-sm">{t("role_employer")}</span>
                  </label>
               </div>
            </div>

            {/* --- TERMS CHECKBOX --- */}
            <div className="mb-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox border border-indigo-500 rounded text-indigo-600 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="ml-2 text-sm font-semibold text-blueGray-600">
                  {t("i_agree_with")}{" "}
                  <a href="#pablo" onClick={e => e.preventDefault()} className="text-indigo-500 hover:underline">
                    {t("privacy_policy")}
                  </a>
                </span>
              </label>
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`bg-indigo-600 text-white active:bg-indigo-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                    <span><i className="fas fa-spinner fa-spin mr-2"></i> {t("processing")}</span>
                ) : t("register_button")}
              </button>
            </div>

            <div className="relative mt-6 mb-4">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-blueGray-200"></div>
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-2 bg-white text-blueGray-500">
                    {t("or_register_with")}
                 </span>
               </div>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150 w-full justify-center"
              >
                <img alt="Google" className="w-5 h-5 mr-2" src={googleIcon} />
                {t("register_with_google")}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="flex flex-wrap mt-6 relative">
        <div className="w-full text-center">
            <p className="text-blueGray-500">
                <span className="text-sm mr-1">{t("already_have_account")}</span>
                <Link to="/auth/login" className="font-bold font-bold text-blueGray-500 hover:text-indigo-500">
                    {t("login_now")}
                </Link>
            </p>
        </div>
      </div>
    </>
  );
}