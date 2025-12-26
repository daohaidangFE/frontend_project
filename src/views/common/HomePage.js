import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/AuthContext";
import jobService from "services/jobService";
import JobCard from "components/Cards/JobCard";

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Danh sách job của trang hiện tại
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Trạng thái hiển thị
  const [showAll, setShowAll] = useState(false); // false: xem gọn, true: xem tất cả

  // Phân trang (0-based theo API)
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Cấu hình số lượng hiển thị
  const ITEMS_PREVIEW = 3;   // Số job khi xem gọn
  const ITEMS_PER_PAGE = 6; // Số job mỗi trang khi xem tất cả

  // Load danh sách job
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

        if (data) {
          setJobs(data.content || []);
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

  // Chuyển trang
  const paginate = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setPage(pageNumber);
      document
        .getElementById("job-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Chuyển chế độ xem
  const handleToggleShow = () => {
    setShowAll((prev) => !prev);
    setPage(0);
  };

  return (
    <>
      {/* Hero */}
      <div className="relative pt-16 pb-32 flex items-center justify-center min-h-screen-75">
        <div
          className="absolute w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1557804506-669a67965ba0')",
          }}
        >
          <span className="absolute w-full h-full bg-black opacity-75"></span>
        </div>

        <div className="container relative mx-auto text-center">
          <h1 className="text-white text-5xl font-semibold">
            {t("home_hero_title")}
          </h1>
          <p className="mt-4 text-lg text-blueGray-200">
            {t("home_hero_subtitle")}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/student/jobs">
              <button className="bg-brand text-white px-8 py-3 rounded font-bold">
                <i className="fas fa-search mr-2" />
                {t("btn_find_jobs")}
              </button>
            </Link>

            {(!user || user.role === "EMPLOYER") && (
              <Link to="/employer/create-job">
                <button className="bg-white text-blueGray-700 px-8 py-3 rounded font-bold">
                  <i className="fas fa-briefcase mr-2" />
                  {t("btn_post_job")}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Latest jobs */}
      <section id="job-section" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center font-semibold mb-12">
            {t("latest_jobs_title")}
          </h2>

          {/* Danh sách job */}
          <div className="flex flex-wrap">
            {loading ? (
              <div className="w-full text-center py-10">
                <i className="fas fa-spinner fa-spin text-2xl text-blueGray-400"></i>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="w-full md:w-6/12 lg:w-4/12 px-4">
                  <JobCard job={job} />
                </div>
              ))
            ) : (
              <div className="w-full text-center text-blueGray-500 py-10">
                Chưa có tin tuyển dụng
              </div>
            )}
          </div>

{showAll && totalPages > 1 && (
            <div className="w-full px-4 mt-8 flex justify-center items-center space-x-2">
                {/* Nút Prev */}
                <button 
                    disabled={page === 0}
                    onClick={() => paginate(page - 1)}
                    className={`px-4 py-2 rounded ${page === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-brand hover:bg-brand hover:text-white shadow'}`}
                >
                    <i className="fas fa-chevron-left mr-1"></i> Prev
                </button>
                
                {/* Text hiển thị trang */}
                <span className="px-4 py-2 bg-white rounded shadow text-blueGray-600 font-semibold">
                    Page {page + 1} / {totalPages}
                </span>

                {/* Nút Next */}
                <button 
                    disabled={page >= totalPages - 1}
                    onClick={() => paginate(page + 1)}
                    className={`px-4 py-2 rounded ${page >= totalPages - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-brand hover:bg-brand hover:text-white shadow'}`}
                >
                    Next <i className="fas fa-chevron-right ml-1"></i>
                </button>
            </div>
          )}

          {/* Toggle Button */}
          {totalElements > ITEMS_PREVIEW && (
            <div className="text-center mt-10">
              <button
                onClick={handleToggleShow}
                className="bg-blueGray-700 text-white px-6 py-3 rounded font-bold hover:shadow-lg transition-all"
              >
                {showAll
                  ? "Thu gọn"
                  : `${t("view_all_jobs")} (${totalElements})`}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
