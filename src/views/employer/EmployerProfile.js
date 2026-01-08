import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import profileService from "services/profileService";
import { useAuth } from "context/AuthContext";

export default function EmployerProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState({
    name: "",
    gender: "UNKNOWN",
    position: "",
    email: "",
  });

  const [companyInfo, setCompanyInfo] = useState({
    id: null,
    name: "",
    industry: "",
    companySize: "",
    address: "",
    websiteUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getMyEmployerProfile();

      if (data) {
        setUserInfo({
          name: data.name || "",
          gender: data.gender || "UNKNOWN",
          position: data.position || "",
          email: user?.email || "",
        });

        if (data.company) {
          setCompanyInfo({
            id: data.company.id,
            name: data.company.name || "",
            industry: data.company.industry || "",
            companySize: data.company.companySize || "",
            address: data.company.address || "",
            websiteUrl: data.company.websiteUrl || "",
            description: data.company.description || "",
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(t("load_profile_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateEmployerProfile({
        name: userInfo.name,
        gender: userInfo.gender,
        position: userInfo.position,
      });
      toast.success(t("update_success"));
    } catch (error) {
      toast.error(error.response?.data?.message || t("update_error"));
    }
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateCompany(companyInfo);
      toast.success(t("update_company_success"));
      window.dispatchEvent(new Event("COMPANY_UPDATED"));
    } catch (error) {
      toast.error(error.response?.data?.message || t("update_error"));
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl font-semibold text-blueGray-600">
          <i className="fas fa-spinner fa-spin mr-2"></i> {t("loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap">
      {/* === CỘT TRÁI: THÔNG TIN CÁ NHÂN === */}
      <div className="w-full lg:w-4/12 px-4">
        {/* FIX Z-INDEX: Thêm relative z-10 */}
        <div className="relative z-10 flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4 flex justify-center">
                <div className="relative">
                  <div className="shadow-xl rounded-full absolute -m-16 -ml-20 lg:-ml-16 w-32 h-32 bg-indigo-500 flex items-center justify-center text-4xl text-white font-bold">
                    {userInfo.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="w-full px-4 text-center mt-20">
                <h3 className="text-xl font-semibold mb-2 text-blueGray-700">
                  {userInfo.name}
                </h3>

                {userInfo.position && (
                  <div className="text-sm mb-2 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-briefcase mr-2"></i>
                    {userInfo.position}
                  </div>
                )}

                <div className="text-sm mb-2 text-blueGray-400 font-bold">
                  <i className="fas fa-envelope mr-2"></i>
                  {userInfo.email}
                </div>

                {companyInfo.name && (
                  <div className="mb-2 text-blueGray-600 mt-2">
                    <i className="fas fa-building mr-2"></i>
                    {companyInfo.name}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 border-t pt-6 pb-6">
              <form onSubmit={handleUpdateUser}>
                <h6 className="text-blueGray-400 text-sm mb-6 font-bold uppercase">
                  {t("personal_info")}
                </h6>
                
                <div className="px-4 mb-4">
                  <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                    {t("full_name", "Họ tên")}
                  </label>
                  <input
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={userInfo.name}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
                  />
                </div>

                <div className="px-4 mb-4">
                  <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                    {t("position")}
                  </label>
                  <input
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={userInfo.position}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, position: e.target.value })
                    }
                  />
                </div>

                <div className="px-4 mb-4">
                  <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                    {t("gender")}
                  </label>
                  <select
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={userInfo.gender}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, gender: e.target.value })
                    }
                  >
                    <option value="MALE">{t("gender_male")}</option>
                    <option value="FEMALE">{t("gender_female")}</option>
                    <option value="OTHER">{t("gender_other")}</option>
                    <option value="UNKNOWN">{t("gender_unknown")}</option>
                  </select>
                </div>

                <div className="flex justify-center">
                  <button className="bg-indigo-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
                    {t("save_changes")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* === CỘT PHẢI: THÔNG TIN CÔNG TY === */}
      {/* FIX ALIGNMENT: Thêm mt-16 để bằng cột trái */}
      <div className="w-full lg:w-8/12 px-4 mt-16">
        {/* FIX Z-INDEX: Thêm relative z-10 */}
        <div className="relative z-10 bg-blueGray-100 shadow-lg rounded-lg border-0">
          <div className="bg-white px-6 py-6 rounded-t mb-0">
            <h6 className="text-blueGray-700 text-xl font-bold">
              {t("company_profile")}
            </h6>
          </div>

          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleUpdateCompany}>
              {/* --- Thông tin chung --- */}
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                {t("company_info", "Thông tin chung")}
              </h6>
              
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("company_name", "Tên công ty")}
                    </label>
                    <input
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={companyInfo.name}
                        onChange={(e) =>
                        setCompanyInfo({ ...companyInfo, name: e.target.value })
                        }
                        required
                    />
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("website_url", "Website")}
                    </label>
                    <input
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={companyInfo.websiteUrl}
                        onChange={(e) =>
                        setCompanyInfo({ ...companyInfo, websiteUrl: e.target.value })
                        }
                    />
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("industry", "Lĩnh vực")}
                    </label>
                    <input
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={companyInfo.industry}
                        onChange={(e) =>
                        setCompanyInfo({ ...companyInfo, industry: e.target.value })
                        }
                    />
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("company_size", "Quy mô")}
                    </label>
                    <input
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={companyInfo.companySize}
                        onChange={(e) =>
                        setCompanyInfo({ ...companyInfo, companySize: e.target.value })
                        }
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              {/* --- Thông tin liên hệ --- */}
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                {t("contact_info", "Thông tin liên hệ")}
              </h6>
              <div className="flex flex-wrap">
                {/* ĐỊA CHỈ */}
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("address", "Địa chỉ")}
                    </label>
                    <input
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={companyInfo.address}
                        onChange={(e) =>
                        setCompanyInfo({ ...companyInfo, address: e.target.value })
                        }
                    />
                  </div>
                </div>

                {/* EMAIL LIÊN HỆ (LẤY TỪ USER EMAIL - READONLY) */}
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        disabled
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-500 bg-blueGray-200 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 cursor-not-allowed"
                        value={userInfo.email}
                        title="Email được lấy từ tài khoản của bạn"
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />

              {/* --- Giới thiệu --- */}
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                {t("about_company", "Giới thiệu")}
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full px-4">
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("description", "Mô tả chi tiết")}
                    </label>
                    <textarea
                        rows="4"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={companyInfo.description}
                        onChange={(e) =>
                        setCompanyInfo({
                            ...companyInfo,
                            description: e.target.value,
                        })
                        }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
                  {t("save_company_info")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}