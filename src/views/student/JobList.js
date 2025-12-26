import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import jobService from "services/jobService";
import JobCard from "components/Cards/JobCard.js";
import { LOCATIONS } from "constants/index";

export default function JobList() {
  const { t } = useTranslation();

  // Danh sách job
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Trạng thái phân trang
  const [pagination, setPagination] = useState({
    page: 0,        // Trang hiện tại (bắt đầu từ 0)
    size: 9,       // Số job mỗi trang
    totalPages: 0,  // Tổng số trang
    totalElements: 0
  });

  // Bộ lọc tìm kiếm
  const [filters, setFilters] = useState({
    keyword: "",
    workMode: "ALL",
    location: ""
  });

  // Gọi API lấy danh sách job theo trang
  const fetchJobs = async (pageIndex = 0) => {
    setLoading(true);
    try {
      const data = await jobService.searchJobs(
        filters.keyword,
        filters.workMode,
        filters.location,
        "",
        "",
        pageIndex,
        pagination.size
      );

      if (data) {
        setJobs(data.content || []);
        setPagination((prev) => ({
          ...prev,
          page: pageIndex,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0
        }));
      }
    } catch (error) {
      console.error("Lỗi load job:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu lần đầu
  useEffect(() => {
    fetchJobs(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Submit form tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(0); // Tìm mới thì quay về trang đầu
  };

  // Chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchJobs(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Thay đổi bộ lọc
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4">

        {/* Thanh tìm kiếm */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="w-full lg:w-10/12 px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-blueGray-700">
              {t("find_dream_job", "Tìm công việc mơ ước")}
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                  {/* Từ khóa */}
                  <div className="md:col-span-5 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blueGray-400">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      name="keyword"
                      className="w-full pl-10 pr-3 py-3 rounded border border-blueGray-300 outline-none text-sm"
                      placeholder={t("search_placeholder", "Tên công việc, vị trí...")}
                      value={filters.keyword}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Hình thức làm việc */}
                  <div className="md:col-span-3 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blueGray-400">
                      <i className="fas fa-briefcase"></i>
                    </span>
                    <select
                      name="workMode"
                      className="w-full pl-10 pr-3 py-3 rounded border border-blueGray-300 outline-none text-sm bg-white"
                      value={filters.workMode}
                      onChange={handleChange}
                    >
                      <option value="ALL">Tất cả hình thức</option>
                      <option value="ONSITE">Tại văn phòng</option>
                      <option value="REMOTE">Làm từ xa</option>
                      <option value="HYBRID">Hybrid</option>
                    </select>
                  </div>

                  {/* Địa điểm */}
                  <div className="md:col-span-3 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blueGray-400">
                      <i className="fas fa-map-marker-alt"></i>
                    </span>
                    <select
                      name="location"
                      className="w-full pl-10 pr-3 py-3 rounded border border-blueGray-300 outline-none text-sm bg-white"
                      value={filters.location}
                      onChange={handleChange}
                    >
                      <option value="">Tất cả địa điểm</option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Nút tìm kiếm */}
                  <div className="md:col-span-1">
                    <button
                      type="submit"
                      className="w-full h-full bg-brand text-white font-bold rounded hover:shadow-lg flex items-center justify-center"
                    >
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Danh sách job */}
        <div className="flex flex-wrap -mx-4">
          {loading ? (
            <div className="w-full text-center py-20">
              <i className="fas fa-spinner fa-spin text-4xl text-brand mb-4"></i>
              <p className="text-blueGray-500 font-semibold">Đang tìm kiếm...</p>
            </div>
          ) : (
            <>
              {jobs.length > 0 ? (
                <>
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="w-full md:w-6/12 lg:w-4/12 px-4 mb-6 flex"
                    >
                      <JobCard job={job} />
                    </div>
                  ))}

                  {/* Phân trang */}
                  {pagination.totalPages > 1 && (
                    <div className="w-full px-4 mt-4 flex justify-center items-center space-x-2">
                      <button
                        disabled={pagination.page === 0}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className={`px-4 py-2 rounded ${
                          pagination.page === 0
                            ? "bg-gray-200 text-gray-400"
                            : "bg-white text-brand hover:bg-brand hover:text-white shadow"
                        }`}
                      >
                        Prev
                      </button>

                      <span className="px-4 py-2 bg-white rounded shadow font-semibold text-blueGray-600">
                        Trang {pagination.page + 1} / {pagination.totalPages}
                      </span>

                      <button
                        disabled={pagination.page >= pagination.totalPages - 1}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className={`px-4 py-2 rounded ${
                          pagination.page >= pagination.totalPages - 1
                            ? "bg-gray-200 text-gray-400"
                            : "bg-white text-brand hover:bg-brand hover:text-white shadow"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full bg-white rounded-lg shadow p-12 text-center mx-4">
                  <i className="fas fa-search text-6xl text-blueGray-200 mb-4"></i>
                  <h3 className="text-2xl font-bold text-blueGray-700 mb-2">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-blueGray-500">
                    Thử thay đổi từ khóa hoặc bộ lọc.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
