import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/AuthContext";

// Services
import jobService from "services/jobService";
import profileService from "services/profileService";

// Components & Constants
import JobCard from "components/Cards/JobCard";
import { PROVINCE_API_URL } from "constants/index";

const getCleanProvinceName = (fullName) => {
  if (!fullName) return "";
  return fullName.replace(/^(Thành phố|Tỉnh)\s+/i, "");
};

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [provinces, setProvinces] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    workMode: "ALL",
    location: "",
  });

  const ITEMS_PREVIEW = 6;
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const url = PROVINCE_API_URL || "https://provinces.open-api.vn/api/?depth=1";
        const response = await fetch(url);
        const data = await response.json();
        setProvinces(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi lấy danh sách tỉnh thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  // --- HÀM ĐÃ ĐƯỢC SỬA LẠI LOGIC ---
  const fetchJobsData = async (pageIndex = 0) => {
    setLoading(true);
    try {
      const pageSize = showAll ? ITEMS_PER_PAGE : ITEMS_PREVIEW;
      const targetPage = showAll ? pageIndex : 0;

      const data = await jobService.searchJobs(
        filters.keyword,
        filters.workMode,
        filters.location,
        "", "", targetPage, pageSize
      );

      if (data && data.content) {
        const rawJobs = data.content;

        // 1. Lấy danh sách ID công ty (lọc trùng & null)
        const uniqueCompanyIds = [...new Set(rawJobs.map((j) => j.companyId).filter((id) => id))];

        // 2. Gọi API lấy thông tin các công ty
        const companyInfos = await Promise.all(
          uniqueCompanyIds.map(async (id) => {
            try {
              const res = await profileService.getCompanyById(id);
              return { id, data: res };
            } catch {
              return { id, data: null };
            }
          })
        );

        // 3. Tạo Map để tra cứu nhanh
        const companyMap = {};
        companyInfos.forEach((item) => {
          if (item.data) companyMap[item.id] = item.data;
        });

        // 4. Gộp dữ liệu (Fix lỗi không hiện tên)
        const enrichedJobs = rawJobs.map((job) => {
          // Nếu tìm thấy công ty trong Map -> Lấy thông tin từ Map
          if (job.companyId && companyMap[job.companyId]) {
            const comp = companyMap[job.companyId];
            return {
              ...job,
              companyName: comp.name,
              companyLogo: comp.logoUrl,
            };
          }
          // Nếu không tìm thấy -> Giữ nguyên (hoặc gán Unknown nếu chưa có)
          return {
            ...job,
            companyName: job.companyName || t("unknown_company"),
            companyLogo: job.companyLogo || null,
          };
        });

        setJobs(enrichedJobs);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setPage(targetPage);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Load jobs failed", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };
  // ------------------------------------

  useEffect(() => {
    fetchJobsData(page);
  }, [showAll, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowAll(true);
    fetchJobsData(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleShow = () => {
    setShowAll((prev) => !prev);
    setPage(0);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative pt-12 pb-12 flex items-center justify-center min-h-screen-75">
        <div
          className="absolute w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0')" }}
        >
          <span className="absolute w-full h-full bg-black opacity-60"></span>
        </div>

        <div className="container relative mx-auto text-center z-10 px-4">
          <div className="w-full lg:w-10/12 px-4 mx-auto">
            <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight mb-2">
              {t("home_hero_title")}
            </h1>
            <p className="text-lg text-blueGray-200 mb-8 opacity-90">
              {t("home_hero_subtitle")}
            </p>

            {/* --- SEARCH FORM --- */}
            <div className="bg-white rounded shadow-xl p-1.5 md:p-2 text-left max-w-5xl mx-auto relative z-20">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                
                {/* Keyword */}
                <div className="md:col-span-5">
                  <input
                    type="text"
                    name="keyword"
                    className="w-full px-4 py-3 rounded border-none bg-blueGray-50 outline-none text-sm focus:ring-1 focus:ring-indigo-400 transition-all"
                    placeholder={t("search_placeholder")}
                    value={filters.keyword}
                    onChange={handleChange}
                  />
                </div>

                {/* WorkMode */}
                <div className="md:col-span-3">
                  <select
                    name="workMode"
                    className="w-full px-4 py-3 rounded border-none bg-blueGray-50 outline-none text-sm bg-white focus:ring-1 focus:ring-indigo-400 cursor-pointer"
                    value={filters.workMode}
                    onChange={handleChange}
                  >
                    <option value="ALL">{t("all_work_modes")}</option>
                    <option value="ONSITE">{t("onsite")}</option>
                    <option value="REMOTE">{t("remote")}</option>
                    <option value="HYBRID">{t("hybrid")}</option>
                  </select>
                </div>

                {/* Location */}
                <div className="md:col-span-3">
                  <select
                    name="location"
                    className="w-full px-4 py-3 rounded border-none bg-blueGray-50 outline-none text-sm bg-white focus:ring-1 focus:ring-indigo-400 cursor-pointer"
                    value={filters.location}
                    onChange={handleChange}
                  >
                    <option value="">{t("all_locations")}</option>
                    {provinces?.map((prov) => (
                      <option key={prov.code} value={getCleanProvinceName(prov.name)}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-1">
                  <button
                    type="submit"
                    className="w-full h-full bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all flex items-center justify-center py-3 md:py-0 font-bold"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
            </div>
            
            {/* Quick Action Button */}
            <div className="mt-6">
               {(!user || user.role === "EMPLOYER") && (
                <Link to="/employer/create-job">
                  <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blueGray-700 font-bold uppercase text-[10px] px-6 py-2 rounded transition-all">
                    {t("btn_post_job")}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main List Section */}
      <section id="job-section" className="py-12 bg-blueGray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-8">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-3xl font-semibold text-blueGray-700 uppercase tracking-wider">
                {filters.keyword || filters.location ? t("search_results") : t("latest_jobs_title")}
              </h2>
              <div className="h-1 w-12 bg-indigo-500 mx-auto mt-2 rounded"></div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-4">
            {loading ? (
              <div className="w-full text-center py-12 text-blueGray-500">
                <i className="fas fa-spinner fa-spin text-2xl mr-2"></i> {t("loading")}...
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="w-full md:w-6/12 lg:w-4/12 px-4 mb-6 flex items-stretch">
                  <JobCard job={job} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-12 text-blueGray-400">
                {t("no_jobs_found")}
              </div>
            )}
          </div>

          {/* Pagination */}
          {showAll && totalPages > 1 && (
            <div className="w-full px-4 mt-8 flex justify-center items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all shadow ${
                  page === 0 ? "bg-blueGray-100 text-blueGray-300" : "bg-white text-indigo-600"
                }`}
              >
                {t("pagination_prev")}
              </button>
              <span className="text-[10px] font-bold text-blueGray-600">
                {page + 1} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all shadow ${
                  page >= totalPages - 1 ? "bg-blueGray-100 text-blueGray-300" : "bg-white text-indigo-600"
                }`}
              >
                {t("pagination_next")}
              </button>
            </div>
          )}

          {/* View All Button */}
          {totalElements > ITEMS_PREVIEW && (
            <div className="text-center mt-10">
              <button
                onClick={handleToggleShow}
                className="bg-indigo-600 text-white font-bold uppercase text-[10px] px-8 py-3 rounded shadow hover:shadow-lg transition-all tracking-widest"
              >
                {showAll ? t("collapse_list") : `${t("view_all_jobs")} (${totalElements})`}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}