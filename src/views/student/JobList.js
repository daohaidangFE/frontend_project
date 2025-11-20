import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import jobService from "services/jobService";
import JobCard from "components/Cards/JobCard.js";

export default function JobList() {
  const { t } = useTranslation();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State lưu trữ bộ lọc
  const [filters, setFilters] = useState({
    keyword: "",
    workMode: "",
    location: ""
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.searchJobs(filters.keyword, filters.workMode);
      setJobs(data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách job:", error);
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
    setFilters(prev => ({
        ...prev,
        [name]: value
    }));
  };

  return (
    // Container chính: padding top để tránh navbar, nền xám nhẹ
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4">
        
        {/* --- Phần Tìm kiếm (Đơn giản hóa) --- */}
        <div className="flex flex-wrap justify-center mb-8">
            <div className="w-full lg:w-10/12 px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-blueGray-700">
                    {t('find_dream_job')}
                </h2>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSearch}>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            
                            {/* 1. Keyword */}
                            <div className="md:col-span-5 relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blueGray-400">
                                    <i className="fas fa-search"></i>
                                </span>
                                <input 
                                    type="text"
                                    name="keyword"
                                    className="w-full pl-10 pr-3 py-3 rounded border border-blueGray-300 focus:border-brand focus:ring-1 focus:ring-brand outline-none text-sm transition-all"
                                    placeholder={t('search_placeholder')}
                                    value={filters.keyword}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* 2. Work Mode */}
                            <div className="md:col-span-3 relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blueGray-400">
                                    <i className="fas fa-briefcase"></i>
                                </span>
                                <select
                                    name="workMode"
                                    className="w-full pl-10 pr-3 py-3 rounded border border-blueGray-300 focus:border-brand focus:ring-1 focus:ring-brand outline-none text-sm appearance-none bg-white transition-all cursor-pointer"
                                    value={filters.workMode}
                                    onChange={handleChange}
                                >
                                    <option value="">{t('work_mode_all')}</option>
                                    <option value="ONSITE">{t('work_mode_onsite')}</option>
                                    <option value="REMOTE">{t('work_mode_remote')}</option>
                                    <option value="HYBRID">{t('work_mode_hybrid')}</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-blueGray-400">
                                    <i className="fas fa-chevron-down text-xs"></i>
                                </span>
                            </div>

                            {/* 3. Location */}
                            <div className="md:col-span-3 relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blueGray-400">
                                    <i className="fas fa-map-marker-alt"></i>
                                </span>
                                <select
                                    name="location"
                                    className="w-full pl-10 pr-3 py-3 rounded border border-blueGray-300 focus:border-brand focus:ring-1 focus:ring-brand outline-none text-sm appearance-none bg-white transition-all cursor-pointer"
                                    value={filters.location}
                                    onChange={handleChange}
                                >
                                    <option value="">{t('location')}</option>
                                    <option value="Hà Nội">Hà Nội</option>
                                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                    <option value="Cần Thơ">Cần Thơ</option>
                                    <option value="Hải Phòng">Hải Phòng</option>
                                    <option value="Khác">Khác</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-blueGray-400">
                                    <i className="fas fa-chevron-down text-xs"></i>
                                </span>
                            </div>

                            {/* 4. Button */}
                            <div className="md:col-span-1">
                                <button 
                                    type="submit"
                                    className="w-full h-full bg-brand text-white font-bold uppercase text-sm rounded hover:opacity-90 shadow hover:shadow-lg outline-none focus:outline-none transition-all duration-150 flex items-center justify-center py-3 md:py-0"
                                >
                                    <i className="fas fa-search md:hidden mr-2"></i> 
                                    <i className="fas fa-arrow-right hidden md:block"></i>
                                    <span className="md:hidden">{t('search')}</span>
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>

        {/* --- Danh sách Job --- */}
        <div className="flex flex-wrap">
            {loading ? (
                <div className="w-full text-center py-20">
                    <i className="fas fa-spinner fa-spin text-4xl text-brand mb-4"></i>
                    <p className="text-blueGray-500 font-semibold">{t('loading')}</p>
                </div>
            ) : (
                <>
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div className="w-full md:w-6/12 lg:w-4/12 px-4" key={job.id}>
                                <JobCard job={job} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full bg-white rounded-lg shadow p-12 text-center">
                            <div className="text-blueGray-200 mb-4">
                                <i className="fas fa-search text-6xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-blueGray-700 mb-2">
                                {t('no_jobs_found')}
                            </h3>
                            <p className="text-blueGray-500">
                                Hãy thử tìm với từ khóa khác xem sao.
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