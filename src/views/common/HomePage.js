import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/AuthContext";
import jobService from "services/jobService";
import profileService from "services/profileService";
import JobCard from "components/Cards/JobCard";

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const ITEMS_PREVIEW = 6;
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const pageSize = showAll ? ITEMS_PER_PAGE : ITEMS_PREVIEW;
        const pageIndex = showAll ? page : 0;

        const data = await jobService.searchJobs(
          "",
          "",
          "",
          "",
          "",
          pageIndex,
          pageSize
        );

        if (data && data.content) {
          const rawJobs = data.content;

          const allCompanyIds = rawJobs
            .map((j) => j.companyId)
            .filter((id) => id);

          const uniqueCompanyIds = [...new Set(allCompanyIds)];

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

          const companyMap = {};
          companyInfos.forEach((item) => {
            if (item.data) {
              companyMap[item.id] = item.data;
            }
          });

          const enrichedJobs = rawJobs.map((job) => {
            if (job.companyId && companyMap[job.companyId]) {
              const comp = companyMap[job.companyId];
              return {
                ...job,
                companyName: comp.name,
                companyLogo: comp.logoUrl,
              };
            }
            return job;
          });

          setJobs(enrichedJobs);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
        }
      } catch (err) {
        console.error("Load jobs failed", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [showAll, page]);

  const paginate = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setPage(pageNumber);
      document
        .getElementById("job-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleToggleShow = () => {
    setShowAll((prev) => !prev);
    setPage(0);
  };

  return (
    <>
      <div className="relative pt-16 pb-32 flex items-center justify-center min-h-screen-75">
        <div
          className="absolute w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1557804506-669a67965ba0')",
          }}
        >
          <span className="absolute w-full h-full bg-black opacity-60"></span>
        </div>

        <div className="container relative mx-auto text-center z-10 px-4">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-8/12 px-4 mx-auto">
              <h1 className="text-white font-semibold text-5xl leading-tight">
                {t("home_hero_title")}
              </h1>
              <p className="mt-4 text-lg text-blueGray-200">
                {t("home_hero_subtitle")}
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/student/jobs">
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase text-sm px-8 py-3 rounded shadow-lg hover:shadow-xl outline-none focus:outline-none transition-all duration-150 transform hover:-translate-y-1">
                    <i className="fas fa-search mr-2"></i>
                    {t("btn_find_jobs")}
                  </button>
                </Link>

                {(!user || user.role === "EMPLOYER") && (
                  <Link to="/employer/create-job">
                    <button className="bg-white text-blueGray-700 hover:bg-blueGray-50 font-bold uppercase text-sm px-8 py-3 rounded shadow-lg hover:shadow-xl outline-none focus:outline-none transition-all duration-150 transform hover:-translate-y-1">
                      <i className="fas fa-briefcase mr-2"></i>
                      {t("btn_post_job")}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="job-section" className="py-20 bg-blueGray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-12">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold text-blueGray-700">
                {t("latest_jobs_title")}
              </h2>
              <p className="text-lg leading-relaxed m-4 text-blueGray-500">
                {t(
                  "latest_jobs_subtitle",
                  "Cập nhật những cơ hội việc làm mới nhất hàng ngày."
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap">
            {loading ? (
              <div className="w-full text-center py-12">
                <i className="fas fa-spinner fa-spin text-3xl text-indigo-600"></i>
                <p className="mt-2 text-blueGray-500">
                  {t("loading", "Đang tải...")}
                </p>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="w-full md:w-6/12 lg:w-4/12 px-4 mb-6 flex"
                >
                  <JobCard job={job} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-12">
                <div className="text-blueGray-400 mb-4">
                  <i className="fas fa-search text-6xl opacity-30"></i>
                </div>
                <p className="text-lg text-blueGray-500">
                  {t("no_jobs_found", "Hiện chưa có tin tuyển dụng nào.")}
                </p>
              </div>
            )}
          </div>

          {showAll && totalPages > 1 && (
            <div className="w-full px-4 mt-10 flex justify-center items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => paginate(page - 1)}
                className={`px-4 py-2 rounded font-bold uppercase text-xs shadow transition-all duration-150 ${
                  page === 0
                    ? "bg-blueGray-200 text-blueGray-400 cursor-not-allowed"
                    : "bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white"
                }`}
              >
                <i className="fas fa-chevron-left mr-1"></i>{" "}
                {t("pagination_prev", "Prev")}
              </button>

              <span className="px-4 py-2 bg-white rounded shadow text-blueGray-700 font-bold text-xs">
                {page + 1} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages - 1}
                onClick={() => paginate(page + 1)}
                className={`px-4 py-2 rounded font-bold uppercase text-xs shadow transition-all duration-150 ${
                  page >= totalPages - 1
                    ? "bg-blueGray-200 text-blueGray-400 cursor-not-allowed"
                    : "bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white"
                }`}
              >
                {t("pagination_next", "Next")}{" "}
                <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
          )}

          {totalElements > ITEMS_PREVIEW && (
            <div className="text-center mt-12">
              <button
                onClick={handleToggleShow}
                className="bg-indigo-600 active:bg-indigo-700 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none transition-all duration-150"
              >
                {showAll
                  ? t("collapse_list", "Thu gọn danh sách")
                  : `${t("view_all_jobs", "Xem tất cả")} (${totalElements})`}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
