import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import jobService from "services/jobService";
import JobCard from "components/Cards/JobCard.js"; // Import Component JobCard

// --- IMPORT CHUẨN TỪ CONSTANTS ---
import { LOCATIONS } from "constants/index"; 

export default function JobList() {
  const { t } = useTranslation();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    keyword: "",
    workMode: "ALL", 
    location: ""
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.searchJobs(
        filters.keyword, 
        filters.workMode, 
        filters.location
      );
      setJobs(data || []);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4">
        
        {/* --- Thanh tìm kiếm --- */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="w-full lg:w-10/12 px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-blueGray-700">
              {t('find_dream_job', 'Tìm công việc mơ ước')}
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Keyword */}
                  <div className="md:col-span-5 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blueGray-400">
                      <i className="fas fa-search"></i>
                    </span>
                    <input 
                      type="text"
                      name="keyword"
                      className="w-full pl-10 pr-3 py-3 rounded border border-blueGray-300 focus:border-brand outline-none text-sm transition-all"
                      placeholder={t('search_placeholder', 'Tên công việc, vị trí...')}
                      value={filters.keyword}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Work Mode */}
                  <div className="md:col-span-3 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blueGray-400">
                      <i className="fas fa-briefcase"></i>
                    </span>
                    <select
                      name="workMode"
                      className="w-full pl-10 pr-3 py-3 rounded border border-blueGray-300 focus:border-brand outline-none text-sm appearance-none bg-white cursor-pointer"
                      value={filters.workMode}
                      onChange={handleChange}
                    >
                      <option value="ALL">{t('work_mode_all', 'Tất cả hình thức')}</option>
                      <option value="ONSITE">{t('work_mode_onsite', 'Tại văn phòng')}</option>
                      <option value="REMOTE">{t('work_mode_remote', 'Làm từ xa')}</option>
                      <option value="HYBRID">{t('work_mode_hybrid', 'Linh hoạt (Hybrid)')}</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div className="md:col-span-3 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blueGray-400">
                      <i className="fas fa-map-marker-alt"></i>
                    </span>
                    <select
                      name="location"
                      className="w-full pl-10 pr-3 py-3 rounded border border-blueGray-300 focus:border-brand outline-none text-sm appearance-none bg-white cursor-pointer"
                      value={filters.location}
                      onChange={handleChange}
                    >
                      <option value="">{t('location', 'Tất cả địa điểm')}</option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-1">
                    <button type="submit" className="w-full h-full bg-brand text-white font-bold uppercase text-sm rounded hover:shadow-lg transition-all flex items-center justify-center py-3 md:py-0">
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* --- Danh sách công việc (SỬA LẠI Ở ĐÂY) --- */}
        <div className="flex flex-wrap -mx-4">
          {loading ? (
            <div className="w-full text-center py-20">
              <i className="fas fa-spinner fa-spin text-4xl text-brand mb-4"></i>
              <p className="text-blueGray-500 font-semibold">{t('loading', 'Đang tìm kiếm...')}</p>
            </div>
          ) : (
            <>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div className="w-full md:w-6/12 lg:w-4/12 px-4 mb-6 flex" key={job.id}>
                    {/* Sử dụng Component JobCard đã được thêm trường Địa điểm */}
                    <JobCard job={job} />
                  </div>
                ))
              ) : (
                <div className="w-full bg-white rounded-lg shadow p-12 text-center mx-4">
                  <i className="fas fa-search text-6xl text-blueGray-200 mb-4"></i>
                  <h3 className="text-2xl font-bold text-blueGray-700 mb-2">{t('no_jobs_found', 'Không tìm thấy kết quả')}</h3>
                  <p className="text-blueGray-500">{t('try_another_keyword', "Thử thay đổi từ khóa hoặc bộ lọc.")}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}