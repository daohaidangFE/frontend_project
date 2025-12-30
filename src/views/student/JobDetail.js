import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import apiClient from "services/apiClient";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// --- IMPORT MODAL & SERVICE ---
// import ApplyJobModal from "components/Modals/ApplyJobModal";
import profileService from "services/profileService";

import ApplyModal from "components/Modals/ApplyModal";

export default function JobDetail() {
  const { id } = useParams();                 // Lấy jobId từ URL
  const history = useHistory();
  const { t } = useTranslation();
  
  const [job, setJob] = useState(null);       // Data job
  const [loading, setLoading] = useState(true);

  // --- STATE APPLY ---
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // ================== 1. FETCH JOB DETAIL ==================
  useEffect(() => {
    async function fetchJobData() {
      try {
        const res = await apiClient.get(`/internship-post/detail`, {
          params: { postId: id }
        });

        // Chuẩn hoá data từ BE
        let jobData = res.data.data || res.data.result || res.data;

        // Fetch thêm thông tin công ty nếu có companyId
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
            jobData.companyName = t("unknown_company", "Công ty ẩn danh");
          }
        }

        setJob(jobData);
      } catch (error) {
        console.error(error);
        toast.error(t("post_not_found", "Không tìm thấy bài đăng!"));
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
      try {
        setIsCheckingProfile(true);
        const userData = await profileService.getMe();
        if (userData) setCurrentUserProfile(userData);
      } catch (e) {
        console.warn("Chưa đăng nhập hoặc lỗi profile:", e);
      } finally {
        setIsCheckingProfile(false);
      }
    }
    fetchMe();
  }, []);

  // ================== 3. HANDLE APPLY ==================
const handleApplyClick = () => {
      if (isCheckingProfile) {
        toast.info("Đang kiểm tra thông tin...");
        return;
      }

      // Chưa đăng nhập -> Giữ lại
      if (!currentUserProfile) {
        toast.info(t("login_required", "Vui lòng đăng nhập để ứng tuyển!"));
        history.push("/auth/login");
        return;
      }

      setShowApplyModal(true);
  };

  // Sau khi confirm apply
  const handleConfirmApply = async () => {
    toast.success(t("apply_success", "Đã gửi hồ sơ thành công!"));
    setShowApplyModal(false);
  };

  // ================== LOADING STATE ==================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blueGray-100">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-4xl text-brand mb-4"></i>
          <p className="text-blueGray-500 font-medium">
            {t("loading_data", "Đang tải dữ liệu...")}
          </p>
        </div>
      </div>
    );
  }

  if (!job) return null;

  // ================== RENDER ==================
  return (
    <div className="bg-blueGray-100 min-h-screen pb-20">

      {/* ===== HEADER ===== */}
      <div className="relative bg-blueGray-800 md:pt-32 pb-40 pt-12 overflow-hidden">
        <div
          className="absolute top-0 w-full h-full bg-blueGray-800 opacity-50"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="text-blueGray-300 text-sm mb-6">
            <Link to="/" className="hover:text-white">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/student/jobs" className="hover:text-white">Việc làm</Link>
            <span className="mx-2">/</span>
            <span className="text-white opacity-80 truncate">{job.title}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center">
            {/* Logo */}
            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center shadow-2xl mb-4 md:mr-8">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt="Logo" className="w-16 h-16 object-contain" />
              ) : (
                <i className="fas fa-building text-4xl text-blueGray-300" />
              )}
            </div>

            {/* Title */}
            <div className="text-white flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-blueGray-200">
                <span>
                  <i className="far fa-building mr-2 text-lightBlue-400" />
                  {job.companyName}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  <i className="fas fa-clock mr-2" />
                  {job.duration || "Toàn thời gian"}
                </span>
              </div>
            </div>

            {/* Apply Button Desktop */}
            <div className="hidden md:block">
              <button
                onClick={handleApplyClick}
                disabled={isCheckingProfile}
                className={`font-bold uppercase text-sm px-8 py-4 rounded-lg transition
                  ${isCheckingProfile
                    ? "bg-blueGray-400 text-blueGray-200"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
              >
                <i className="fas fa-paper-plane mr-2" />
                {isCheckingProfile ? "Checking..." : "Ứng tuyển ngay"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="container mx-auto px-4 -mt-24 relative z-20">
        <div className="flex flex-wrap">

          {/* MAIN CONTENT */}
          <div className="w-full lg:w-8/12 px-4 mb-6">
            <div className="bg-white shadow-xl rounded-lg p-8">

              {/* Skills */}
              {job.skills?.length > 0 && (
                <div className="mb-8 border-b pb-8">
                  <h6 className="font-bold mb-4">Kỹ năng chuyên môn</h6>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map(skill => (
                      <span
                        key={skill.id}
                        className="bg-lightBlue-50 text-lightBlue-600 px-4 py-2 rounded-lg text-sm font-bold"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h6 className="font-bold mb-4">Mô tả chi tiết</h6>
                <div className="text-blueGray-600 whitespace-pre-line text-justify">
                  {job.description}
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-4/12 px-4">
            <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
              <InfoItem icon="fa-money-bill-wave" color="emerald" label="Mức lương" value="Thỏa thuận" />
              <InfoItem icon="fa-map-marker-alt" color="red" label="Địa điểm" value={job.location} />
              <InfoItem icon="fa-briefcase" color="orange" label="Hình thức" value={job.workMode} />
            </div>

            {/* Apply Mobile */}
            <button
              onClick={handleApplyClick}
              className="w-full bg-emerald-500 text-white font-bold py-3 rounded md:hidden"
            >
              Ứng tuyển ngay
            </button>
          </div>
        </div>
      </div>

      {/* APPLY MODAL */}
      <ApplyModal
        show={showApplyModal}
        setShow={setShowApplyModal}
        jobPostId={id}
        jobTitle={job.title}
      />
    </div>
  );
}

// ================== SUB COMPONENT ==================
function InfoItem({ icon, color, label, value }) {
  const colorClasses = {
    emerald: "text-emerald-500 bg-emerald-100",
    red: "text-red-500 bg-red-100",
    orange: "text-orange-500 bg-orange-100",
  };

  return (
    <div className="flex items-center mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${colorClasses[color]}`}>
        <i className={`fas ${icon}`} />
      </div>
      <div>
        <div className="text-xs text-blueGray-400 font-bold">{label}</div>
        <div className="text-blueGray-700 font-semibold">{value || "N/A"}</div>
      </div>
    </div>
  );
}
