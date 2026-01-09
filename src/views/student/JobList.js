import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { toast } from "react-toastify";

// Import Services
import jobService from "services/jobService";
import profileService from "services/profileService";
import matchingService from "services/matchingService";
import cvService from "services/cvService";

import JobCard from "components/Cards/JobCard.js";

/**
 * Hàm Helper lấy tọa độ GPS từ trình duyệt
 */
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Trình duyệt không hỗ trợ định vị");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => reject(err),
        { timeout: 8000 } // Chờ tối đa 8 giây
      );
    }
  });
};

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
      // 1. Lấy danh sách CV của sinh viên
      const myCVs = await cvService.getMyCVs();
      if (!myCVs || myCVs.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      // Ưu tiên lấy CV mặc định, nếu không có lấy cái mới nhất
      const defaultCV = myCVs.find((cv) => cv.default === true) || myCVs[myCVs.length - 1];
      const targetCvId = defaultCV.id;

      // 2. TỰ ĐỘNG XÁC ĐỊNH VỊ TRÍ
      let locationParams = { lat: null, lon: null, maxDistanceKm: 10 };
      try {
        const coords = await getCurrentLocation();
        locationParams.lat = coords.lat;
        locationParams.lon = coords.lon;
        // console.log("📍 GPS detected:", coords);
        toast.success(t("location_detected", "Đã xác định vị trí để tối ưu gợi ý!"));
      } catch (locError) {
        console.warn("⚠️ GPS failed or denied:", locError);
      }

      // 3. Gọi Matching Service
      const matchResults = await matchingService.findMyJobs(targetCvId, locationParams);

      if (matchResults && Array.isArray(matchResults)) {
        // Sắp xếp theo điểm số phù hợp giảm dần
        const sortedMatches = matchResults.sort((a, b) => b.score - a.score);
        setAllMatches(sortedMatches);

        const totalParams = {
          page: 0,
          size: 9,
          totalPages: Math.ceil(sortedMatches.length / 9),
          totalElements: sortedMatches.length,
        };
        setPagination(totalParams);

        // Bước 2: Load chi tiết Job cho trang đầu tiên
        await fetchJobDetailsForPage(0, sortedMatches, totalParams.size);
      } else {
        setAllMatches([]);
        setJobs([]);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách gợi ý:", error);
      toast.error(t("match_error", "Không thể lấy dữ liệu gợi ý lúc này"));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Bước 2: Lấy chi tiết Job (Enrich Data)
   */
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

      // Lấy chi tiết bài đăng và gán thêm điểm số/kỹ năng match
      const detailedJobs = await Promise.all(
        currentSlice.map(async (match) => {
          try {
            const jobDetail = await jobService.getJobDetail(match.internshipPostId);
            return {
              ...jobDetail,
              matchScore: match.score,
              matchedSkills: match.matchedSkills,
              distanceKm: match.distanceKm, // Bổ sung khoảng cách
              companyId: match.companyId || jobDetail.companyId,
            };
          } catch (err) {
            return null;
          }
        })
      );

      const validJobs = detailedJobs.filter((j) => j !== null);

      // Lấy thông tin Công ty để hiển thị Logo/Tên
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
      setPagination((prev) => ({ ...prev, page: newPage }));
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
          <Link to="/auth/login" className="bg-indigo-500 text-white px-6 py-3 rounded shadow hover:shadow-lg">
            {t("login_now", "Đăng nhập ngay")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="w-full lg:w-10/12 px-4 text-center">
            <h2 className="text-3xl font-bold text-blueGray-700 mb-2">
              <i className="fas fa-magic text-indigo-500 mr-2"></i>
              {t("suggested_jobs_title", "Việc làm gợi ý cho bạn")}
            </h2>
            <p className="text-lg text-blueGray-500">
              {t("suggested_jobs_desc", "Hệ thống AI phân tích CV và vị trí hiện tại của bạn để tìm công việc phù hợp nhất.")}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-wrap -mx-4">
          {loading ? (
            <div className="w-full text-center py-20">
              <i className="fas fa-spinner fa-spin text-4xl text-indigo-500 mb-4"></i>
              <p className="text-blueGray-500 font-semibold italic text-lg animate-pulse">
                {t("analyzing_profile", "AI đang xác định vị trí và phân tích hồ sơ...")}
              </p>
            </div>
          ) : (
            <>
              {jobs.length > 0 ? (
                <>
                  {jobs.map((job) => (
                    <div key={job.id} className="w-full md:w-6/12 lg:w-4/12 px-4 mb-6 flex">
                      {/* JobCard nhận matchScore để hiển thị % Match */}
                      <JobCard job={job} matchScore={job.matchScore} />
                    </div>
                  ))}

                  {/* Pagination Controls */}
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
                <div className="w-full bg-white rounded-lg shadow p-12 text-center mx-4 border-2 border-dashed border-blueGray-200">
                  <div className="text-blueGray-300 mb-4">
                    <i className="fas fa-search-location text-6xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-blueGray-700 mb-2">
                    {t("no_matches_found", "Chưa tìm thấy công việc phù hợp")}
                  </h3>
                  <p className="text-blueGray-500 mb-6">
                    {t("update_cv_hint", "Hãy đảm bảo bạn đã tải lên CV và đặt nó làm mặc định để AI có thể gợi ý tốt nhất.")}
                  </p>
                  <Link 
                    to="/student/profile" 
                    className="bg-indigo-600 text-white font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 hover:-translate-y-1 transform"
                  >
                    {t("update_profile", "Quản lý CV & Hồ sơ ngay")}
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