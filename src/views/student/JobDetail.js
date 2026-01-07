import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import apiClient from "services/apiClient";
import profileService from "services/profileService";
import ApplyModal from "components/Modals/ApplyModal";

import { useAuth } from "context/AuthContext";

export default function JobDetail() {
  const { id } = useParams();                 
  const history = useHistory();
  const { t } = useTranslation();

  const { user } = useAuth(); 

  const [job, setJob] = useState(null);       
  const [loading, setLoading] = useState(true);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    async function fetchJobData() {
      try {
        const res = await apiClient.get(`/internship-post/detail`, {
          params: { postId: id }
        });

        let jobData = res.data.data || res.data.result || res.data;

        // console.log("Dữ liệu Job chi tiết:", jobData); 
        // console.log("Skills nhận được:", jobData.skills);

        if (jobData.companyId) {
          try {
            const companyRes = await apiClient.get(`/companies/${jobData.companyId}`);
            jobData = { 
              ...jobData, 
              companyName: companyRes.data.name || companyRes.data.result?.name,
              companyAddress: companyRes.data.address || "Hà Nội, Việt Nam",
              companyWebsite: companyRes.data.website || "#",
              companyLogo: companyRes.data.logo
            };
          } catch (err) {
            console.warn("Không lấy được công ty", err);
            jobData.companyName = t("unknown_company");
          }
        }

        setJob(jobData);
      } catch (error) {
        console.error(error);
        toast.error(t("post_not_found"));
        history.push("/student/jobs");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchJobData();
  }, [id, history, t]);

  // ================== 2. FETCH USER PROFILE ==================
  useEffect(() => {
    async function fetchMe() {
      // Chỉ fetch profile nếu đã có user (đã đăng nhập)
      if (!user) {
          setIsCheckingProfile(false);
          return;
      }

      try {
        setIsCheckingProfile(true);
        const userData = await profileService.getMe();
        if (userData) setCurrentUserProfile(userData);
      } catch (e) {
        console.warn("Lỗi lấy profile:", e);
      } finally {
        setIsCheckingProfile(false);
      }
    }
    fetchMe();
  }, [user]); // Chạy lại khi user thay đổi

  const handleApplyClick = () => {
      if (!user) {
        toast.info(t("login_required_to_apply"));
        history.push("/auth/login");
        return;
      }

      // 2. Nếu đang load profile thì đợi xíu
      if (isCheckingProfile) {
        toast.info(t("checking_info"));
        return;
      }

      setShowApplyModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blueGray-100">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-4xl text-lightBlue-500 mb-4"></i>
          <p className="text-blueGray-500 font-medium">
            {t("loading_data")}
          </p>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="bg-blueGray-100 min-h-screen pb-20">

      {/* ===== HEADER ===== */}
      <div className="relative bg-blueGray-800 md:pt-32 pb-40 pt-12 overflow-hidden">
        <div
          className="absolute top-0 w-full h-full bg-blueGray-800 opacity-50"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-blueGray-300 text-sm mb-6">
            <Link to="/" className="hover:text-white">{t("home")}</Link>
            <span className="mx-2">/</span>
            <Link to="/student/jobs" className="hover:text-white">{t("jobs")}</Link>
            <span className="mx-2">/</span>
            <span className="text-white opacity-80 truncate">{job.title}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center shadow-2xl mb-4 md:mr-8 overflow-hidden">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt="Logo" className="w-16 h-16 object-contain" />
              ) : (
                <i className="fas fa-building text-4xl text-blueGray-300" />
              )}
            </div>

            <div className="text-white flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-blueGray-200">
                <span>
                  <i className="far fa-building mr-2 text-lightBlue-400" />
                  {job.companyName}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  <i className="fas fa-clock mr-2" />
                  {job.duration || t("full_time")}
                </span>
              </div>
            </div>

            {/* Apply Button Desktop */}
            <div className="hidden md:block">
              <button
                onClick={handleApplyClick}
                className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-8 py-4 rounded-lg transition shadow-lg"
              >
                <i className="fas fa-paper-plane mr-2" />
                {t("apply_now")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="container mx-auto px-4 -mt-24 relative z-20">
        <div className="flex flex-wrap">

          <div className="w-full lg:w-8/12 px-4 mb-6">
            <div className="bg-white shadow-xl rounded-lg p-8">
              {job.skills?.length > 0 && (
                <div className="mb-8 border-b border-blueGray-100 pb-8">
                  <h6 className="font-bold text-lg text-blueGray-700 mb-4">{t("technical_skills")}</h6>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={skill.id || index}
                          className="bg-blueGray-100 text-blueGray-700 px-3 py-1 rounded text-sm font-semibold border border-blueGray-200"
                        >
                          {/* Tên Skill */}
                          {skill.skillName} 
                          
                          {/* Mức độ (nằm trong ngoặc đơn, chữ nhạt hơn chút) */}
                          {skill.importanceLevel && (
                            <span className="font-normal text-blueGray-500 ml-1">
                              ({skill.importanceLevel})
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                </div>
              )}

              <div>
                <h6 className="font-bold text-lg text-blueGray-700 mb-4">{t("job_description_title")}</h6>
                <div className="text-blueGray-600 whitespace-pre-line text-justify leading-relaxed">
                  {job.description}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-4/12 px-4">
            <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
              <InfoItem icon="fa-money-bill-wave" color="emerald" label={t("salary")} value={t("negotiable")} />
              <InfoItem icon="fa-map-marker-alt" color="red" label={t("location_label")} value={job.location} />
              <InfoItem icon="fa-briefcase" color="orange" label={t("work_mode_label")} value={job.workMode} />
            </div>

            {/* Apply Mobile */}
            <button
              onClick={handleApplyClick}
              className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg md:hidden hover:bg-emerald-600 transition-all"
            >
              {t("apply_now")}
            </button>
          </div>
        </div>
      </div>

      <ApplyModal
        show={showApplyModal}
        setShow={setShowApplyModal}
        jobPostId={id}
        jobTitle={job.title}
      />
    </div>
  );
}

function InfoItem({ icon, color, label, value }) {
  const colorClasses = {
    emerald: "text-emerald-500 bg-emerald-100",
    red: "text-red-500 bg-red-100",
    orange: "text-orange-500 bg-orange-100",
  };

  return (
    <div className="flex items-center mb-4 last:mb-0">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${colorClasses[color]}`}>
        <i className={`fas ${icon}`} />
      </div>
      <div>
        <div className="text-xs text-blueGray-400 font-bold uppercase">{label}</div>
        <div className="text-blueGray-700 font-semibold">{value || "N/A"}</div>
      </div>
    </div>
  );
}