import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "context/AuthContext";

// Import Services
import jobService from "services/jobService";
import profileService from "services/profileService";
import matchingService from "services/matchingService";
import cvService from "services/cvService"; // Đã có file này

import JobCard from "components/Cards/JobCard.js";

export default function SuggestedJobsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [allMatches, setAllMatches] = useState([]); 

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 0,
    size: 9, 
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    if (user && user.role === "STUDENT") {
      fetchMatchingIds();
    }
  }, [user]);

  const fetchMatchingIds = async () => {
    setLoading(true);
    try {
      const myCVs = await cvService.getMyCVs(); 
      
      if (!myCVs || myCVs.length === 0) {
        setLoading(false);
        setJobs([]);
        return; 
      }

      const lastCV = myCVs[myCVs.length - 1]; 
      const targetCvId = lastCV.id;

      const matchResults = await matchingService.findMyJobs(targetCvId);

      if (matchResults && Array.isArray(matchResults)) {
        const sortedMatches = matchResults.sort((a, b) => b.score - a.score);
        
        setAllMatches(sortedMatches); 
        
        const totalParams = {
            page: 0,
            size: 9,
            totalPages: Math.ceil(sortedMatches.length / 9),
            totalElements: sortedMatches.length
        };
        setPagination(totalParams);

        // Load dữ liệu trang đầu tiên
        await fetchJobDetailsForPage(0, sortedMatches, totalParams.size);
      } else {
        setAllMatches([]);
        setJobs([]);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách gợi ý:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Lấy chi tiết Job (Client-side Pagination)
  const fetchJobDetailsForPage = async (pageIndex, allData = allMatches, pageSize = pagination.size) => {
    setLoading(true);
    try {
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      const currentSlice = allData.slice(startIndex, endIndex);

      if (currentSlice.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      // --- ENRICH DATA ---
      const detailedJobs = await Promise.all(
        currentSlice.map(async (match) => {
          try {
            const jobDetail = await jobService.getJobDetail(match.internshipPostId);
            return {
              ...jobDetail,
              matchScore: match.score,         
              matchedSkills: match.matchedSkills, 
              companyId: match.companyId || jobDetail.companyId 
            };
          } catch (err) {
            return null;
          }
        })
      );

      const validJobs = detailedJobs.filter((j) => j !== null);

      // Lấy thông tin Công ty
      const uniqueCompanyIds = [...new Set(validJobs.map((j) => j.companyId).filter((id) => id))];

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
        if (item.data) companyMap[item.id] = item.data;
      });

      const finalJobs = validJobs.map((job) => {
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

      setJobs(finalJobs);

    } catch (error) {
      console.error("Lỗi chi tiết job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchJobDetailsForPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!user || user.role !== "STUDENT") {
    return (
        <div className="bg-blueGray-100 min-h-screen pt-24 pb-10 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-blueGray-700 mb-4">
                    {t("student_access_only", "Trang này chỉ dành cho Sinh viên")}
                </h2>
                <Link to="/auth/login" className="bg-brand text-white px-6 py-3 rounded shadow hover:shadow-lg">
                    {t("login_now", "Đăng nhập ngay")}
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="w-full lg:w-10/12 px-4 text-center">
            <h2 className="text-3xl font-bold text-blueGray-700 mb-2">
              <i className="fas fa-magic text-indigo-500 mr-2"></i>
              {t("suggested_jobs_title", "Việc làm gợi ý cho bạn")}
            </h2>
            <p className="text-lg text-blueGray-500">
               {t("suggested_jobs_desc", "Hệ thống AI phân tích CV mặc định của bạn để tìm công việc phù hợp nhất.")}
            </p>
          </div>
        </div>

        {/* Job List */}
        <div className="flex flex-wrap -mx-4">
          {loading ? (
            <div className="w-full text-center py-20">
              <i className="fas fa-spinner fa-spin text-4xl text-indigo-500 mb-4"></i>
              <p className="text-blueGray-500 font-semibold">
                {t("analyzing_profile", "AI đang phân tích hồ sơ và tìm việc...")}
              </p>
            </div>
          ) : (
            <>
              {jobs.length > 0 ? (
                <>
                  {jobs.map((job) => (
                    <div key={job.id} className="w-full md:w-6/12 lg:w-4/12 px-4 mb-6 flex">
                      <JobCard job={job} matchScore={job.matchScore} />
                    </div>
                  ))}

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="w-full px-4 mt-8 flex justify-center items-center space-x-2">
                      <button
                        disabled={pagination.page === 0}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className={`px-4 py-2 rounded font-bold uppercase text-xs shadow hover:shadow-md outline-none focus:outline-none transition-all duration-150 ${
                          pagination.page === 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white"
                        }`}
                      >
                        {t("prev_page", "Trước")}
                      </button>

                      <span className="px-4 py-2 bg-white rounded shadow font-bold text-blueGray-700 text-xs">
                        {pagination.page + 1} / {pagination.totalPages}
                      </span>

                      <button
                        disabled={pagination.page >= pagination.totalPages - 1}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className={`px-4 py-2 rounded font-bold uppercase text-xs shadow hover:shadow-md outline-none focus:outline-none transition-all duration-150 ${
                          pagination.page >= pagination.totalPages - 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white"
                        }`}
                      >
                        {t("next_page", "Sau")}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full bg-white rounded-lg shadow p-12 text-center mx-4">
                  <div className="text-blueGray-300 mb-4">
                    <i className="fas fa-file-alt text-6xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-blueGray-700 mb-2">
                    {t("no_matches_found", "Chưa tìm thấy công việc phù hợp")}
                  </h3>
                  <p className="text-blueGray-500 mb-6">
                    {t("update_cv_hint", "Hãy đảm bảo bạn đã tải lên CV và đặt nó làm mặc định để AI có thể gợi ý tốt nhất.")}
                  </p>
                  <Link 
                    to="/student/profile" 
                    className="bg-indigo-600 text-white font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  >
                    {t("update_profile", "Quản lý CV ngay")}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}