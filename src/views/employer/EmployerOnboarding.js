import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import profileService from "services/profileService";

export default function EmployerOnboarding() {
  const { t } = useTranslation();
  const history = useHistory();

  const [activeTab, setActiveTab] = useState("join"); // 'join' | 'create'
  const [loading, setLoading] = useState(false);

  // --- STATE CHO JOIN ---
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // --- STATE CHO CREATE ---
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    companySize: "",
    address: "",
    websiteUrl: "",
    description: "",
  });

  // Load danh sách công ty khi vào tab Join
  useEffect(() => {
    if (activeTab === "join") {
      const fetchCompanies = async () => {
        try {
          const res = await profileService.getAllCompanies();
          setCompanies(Array.isArray(res) ? res : []);
        } catch (error) {
          console.error("Lỗi lấy danh sách công ty:", error);
        }
      };
      fetchCompanies();
    }
  }, [activeTab]);

  // Xử lý Join
  const handleJoin = async () => {
    if (!selectedCompanyId) return;
    setLoading(true);
    try {
      await profileService.joinCompany(selectedCompanyId);
      toast.success(t("join_success"));
      window.dispatchEvent(new Event("COMPANY_UPDATED"));
      history.push("/employer/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || t("join_error"));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Create
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileService.createCompany(formData);
      toast.success(t("create_success"));
      window.dispatchEvent(new Event("COMPANY_UPDATED"));
      history.push("/employer/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || t("create_error"));
    } finally {
      setLoading(false);
    }
  };

  // Lọc công ty theo search
  const filteredCompanies = companies.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full mt-10">
        <div className="w-full lg:w-8/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6 bg-white">
              <div className="text-center mb-3">
                <h6 className="text-blueGray-500 text-lg font-bold">
                  {t("welcome_employer")}
                </h6>
                <p className="text-blueGray-400 text-sm mt-1">
                  {t("onboarding_subtitle")}
                </p>
              </div>

              {/* TABS BUTTONS */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setActiveTab("join")}
                  className={`px-4 py-2 mr-2 text-sm font-bold uppercase rounded outline-none focus:outline-none ease-linear transition-all duration-150 ${
                    activeTab === "join"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-white text-blueGray-600 border border-blueGray-300"
                  }`}
                >
                  {t("join_existing")}
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-4 py-2 text-sm font-bold uppercase rounded outline-none focus:outline-none ease-linear transition-all duration-150 ${
                    activeTab === "create"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-white text-blueGray-600 border border-blueGray-300"
                  }`}
                >
                  {t("create_new_company")}
                </button>
              </div>
            </div>

            <div className="flex-auto px-4 lg:px-10 py-10 pt-6 bg-white rounded-b-lg">
              {/* === TAB JOIN === */}
              {activeTab === "join" && (
                <div>
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      {t("search_company")}
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 bg-blueGray-50"
                      placeholder={t("search_placeholder")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="h-64 overflow-y-auto border border-blueGray-200 rounded p-2 mb-4">
                    {filteredCompanies.length === 0 ? (
                      <div className="text-center text-blueGray-400 py-4">
                        {t("no_company_found")}
                      </div>
                    ) : (
                      filteredCompanies.map((company) => (
                        <div
                          key={company.id}
                          onClick={() => setSelectedCompanyId(company.id)}
                          className={`p-3 mb-2 rounded cursor-pointer border transition-all flex justify-between items-center ${
                            selectedCompanyId === company.id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-transparent hover:bg-blueGray-50"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-blueGray-700">
                              {company.name}
                            </div>
                            <div className="text-xs text-blueGray-500">
                              {company.address || t("address_not_updated")}
                            </div>
                          </div>
                          {selectedCompanyId === company.id && (
                            <i className="fas fa-check-circle text-indigo-500 text-xl"></i>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleJoin}
                      disabled={!selectedCompanyId || loading}
                      className={`bg-indigo-600 text-white active:bg-indigo-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150 ${
                        !selectedCompanyId || loading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {loading ? (
                        <span>
                          <i className="fas fa-spinner fa-spin mr-2"></i>{" "}
                          {t("processing")}
                        </span>
                      ) : (
                        t("join_now")
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* === TAB CREATE === */}
              {activeTab === "create" && (
                <form onSubmit={handleCreate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative w-full mb-3 md:col-span-2">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("company_name")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("industry")}
                      </label>
                      <input
                        type="text"
                        placeholder={t("industry_placeholder")}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.industry}
                        onChange={(e) =>
                          setFormData({ ...formData, industry: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("company_size")}
                      </label>
                      <input
                        type="text"
                        placeholder={t("company_size_placeholder")}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.companySize}
                        onChange={(e) =>
                          setFormData({ ...formData, companySize: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative w-full mb-3 md:col-span-2">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("address")}
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="relative w-full mb-3 md:col-span-2">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t("website_url")}
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.websiteUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, websiteUrl: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-indigo-600 text-white active:bg-indigo-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <span>
                          <i className="fas fa-spinner fa-spin mr-2"></i>{" "}
                          {t("creating")}
                        </span>
                      ) : (
                        t("create_and_join")
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}