import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "context/AuthContext";
import jobService from "services/jobService";
import JobCard from "components/Cards/JobCard.js";

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);

  // Load 3-4 job mới nhất để hiển thị demo
  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        // Gọi search rỗng để lấy tất cả, sau đó cắt lấy 3 cái đầu
        // (Sau này backend có API /latest thì thay vào)
        const data = await jobService.searchJobs("");
        if (data && data.length > 0) {
            setRecentJobs(data.slice(0, 3)); // Lấy 3 tin đầu tiên
        }
      } catch (error) {
        console.error("Error loading home jobs", error);
      }
    };
    fetchRecentJobs();
  }, []);

  return (
    <>
      {/* --- HERO SECTION --- */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')",
          }}
        >
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-75 bg-black"
          ></span>
        </div>
        
        <div className="container relative mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="pr-12">
                <h1 className="text-white font-semibold text-5xl">
                  {t('home_hero_title')}
                </h1>
                <p className="mt-4 text-lg text-blueGray-200">
                  {t('home_hero_subtitle')}
                </p>
                
                <div className="mt-8 flex justify-center gap-4">
                    {/* Nút cho Sinh viên */}
                    <Link to="/student/jobs">
                        <button className="bg-brand text-white font-bold uppercase text-base px-8 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                            <i className="fas fa-search mr-2"></i> {t('btn_find_jobs')}
                        </button>
                    </Link>
                    
                    {/* Nút cho Employer (Nếu chưa login hoặc là employer) */}
                    {(!user || user.role === 'EMPLOYER') && (
                        <Link to="/employer/create-job">
                            <button className="bg-white text-blueGray-700 font-bold uppercase text-base px-8 py-3 rounded shadow-md hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                                <i className="fas fa-briefcase mr-2"></i> {t('btn_post_job')}
                            </button>
                        </Link>
                    )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <section className="pb-20 bg-blueGray-200 -mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            
            {/* Feature 1 */}
            <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                    <i className="fas fa-id-card"></i>
                  </div>
                  <h6 className="text-xl font-semibold">{t('feature_1_title')}</h6>
                  <p className="mt-2 mb-4 text-blueGray-500">
                    {t('feature_1_desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400">
                    <i className="fas fa-comments"></i>
                  </div>
                  <h6 className="text-xl font-semibold">{t('feature_2_title')}</h6>
                  <p className="mt-2 mb-4 text-blueGray-500">
                    {t('feature_2_desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400">
                    <i className="fas fa-globe"></i>
                  </div>
                  <h6 className="text-xl font-semibold">{t('feature_3_title')}</h6>
                  <p className="mt-2 mb-4 text-blueGray-500">
                    {t('feature_3_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LATEST JOBS SECTION --- */}
      <section className="relative py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-12">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold text-blueGray-700">
                {t('latest_jobs_title')}
              </h2>
            </div>
          </div>
          
          <div className="flex flex-wrap">
            {recentJobs.length > 0 ? (
                recentJobs.map(job => (
                    <div className="w-full md:w-6/12 lg:w-4/12 px-4" key={job.id}>
                        <JobCard job={job} />
                    </div>
                ))
            ) : (
                <div className="w-full text-center text-blueGray-500">
                    <p>Hiện chưa có tin tuyển dụng nào.</p>
                </div>
            )}
          </div>

          <div className="text-center mt-10">
             <Link to="/student/jobs">
                <button className="bg-blueGray-700 text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                    {t('view_all_jobs')} <i className="fas fa-arrow-right ml-2"></i>
                </button>
             </Link>
          </div>

        </div>
      </section>
    </>
  );
}