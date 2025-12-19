import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import apiClient from "services/apiClient";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// --- IMPORTS MỚI ---
import ApplyJobModal from "components/Modals/ApplyJobModal";
import profileService from "services/profileService";

export default function JobDetail() {
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- STATE MỚI CHO LOGIC ỨNG TUYỂN ---
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  // Thêm state loading cho profile để tránh bị logout oan
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // 1. Lấy thông tin Job (Code cũ)
  useEffect(() => {
    async function fetchJobData() {
      try {
        const res = await apiClient.get(`/internship-post/detail`, {
            params: { postId: id }
        });
        
        let jobData = res.data.data || res.data.result || res.data;

        if (jobData.companyId) {
            try {
                const companyRes = await apiClient.get(`/companies/${jobData.companyId}`);
                jobData = { ...jobData, companyName: companyRes.data.name || companyRes.data.result.name };
            } catch (err) {
                console.warn("Không lấy được tên công ty", err);
                jobData.companyName = t('unknown_company', "Công ty ẩn danh");
            }
        }

        setJob(jobData);
      } catch (error) {
        console.error(error);
        toast.error(t('post_not_found', "Không tìm thấy bài đăng!"));
        history.push("/student/jobs");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchJobData();
  }, [id, history, t]);

  // 2. Lấy thông tin User Profile (ĐÃ SỬA: Thêm loading và check data kỹ hơn)
  useEffect(() => {
    async function fetchMe() {
        try {
            setIsCheckingProfile(true);
            // Gọi hàm mới đã được unwrap sẵn
            const userData = await profileService.getMe();
            
            if (userData) {
                setCurrentUserProfile(userData);
            }
        } catch (e) {
            console.warn("Chưa đăng nhập hoặc lỗi lấy profile:", e);
        } finally {
            setIsCheckingProfile(false);
        }
    }
    fetchMe();
    }, []);

  // 3. Hàm xử lý khi bấm nút "Ứng tuyển ngay" (ĐÃ SỬA: Check trạng thái loading)
  const handleApplyClick = () => {
      // Nếu đang kiểm tra profile thì báo chờ, không logout
      if (isCheckingProfile) {
          toast.info("Đang kiểm tra thông tin người dùng, vui lòng thử lại sau giây lát...");
          return;
      }

      // Nếu load xong mà vẫn không có Profile -> Mới thực sự là chưa đăng nhập
      if (!currentUserProfile) {
          toast.info(t('login_required', "Vui lòng đăng nhập để ứng tuyển!"));
          history.push("/auth/login");
          return;
      }

      // Check xem có CV chưa
      if (!currentUserProfile.cvUrl) {
          const confirmRedirect = window.confirm(t('cv_missing_confirm', "Bạn chưa có CV trong hồ sơ. Bạn có muốn đến trang Profile để tải CV lên không?"));
          if (confirmRedirect) {
              history.push("/student/profile");
          }
          return;
      }

      // Nếu đủ điều kiện -> Mở Modal
      setShowApplyModal(true);
  };

  // 4. Hàm xác nhận gửi hồ sơ
  const handleConfirmApply = async (data) => {
      console.log(">>> GỬI ỨNG TUYỂN:", {
          jobId: job.id,
          employerId: job.postedBy, 
          cvUrl: currentUserProfile.cvUrl,
          coverLetter: data.coverLetter
      });

      // TODO: Sau này thay bằng API thật
      toast.success(t('apply_success', "Đã gửi hồ sơ thành công!"));
      setShowApplyModal(false);
  };

  if (loading) return <div className="p-10 text-center">{t('loading_data', "Đang tải dữ liệu...")}</div>;
  if (!job) return null;

  return (
    <div className="bg-blueGray-100 min-h-screen pb-20">
      {/* Header */}
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-lg mb-4 md:mb-0 md:mr-6">
                   <i className="fas fa-building text-3xl text-lightBlue-600"></i>
                </div>
                <div className="text-center md:text-left text-white flex-1">
                    <h1 className="text-3xl font-bold font-sans leading-tight mb-2">{job.title}</h1>
                    <p className="text-blueGray-200 text-lg font-medium mb-1">
                        <i className="far fa-building mr-2"></i>
                        {job.companyName || t('updating', "Đang cập nhật...")}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                        <span className="bg-white/20 backdrop-blur text-white px-3 py-1 rounded text-sm uppercase font-bold">
                            <i className="fas fa-laptop-house mr-2"></i>{job.workMode}
                        </span>
                        <span className="bg-white/20 backdrop-blur text-white px-3 py-1 rounded text-sm">
                            <i className="fas fa-user-tag mr-2"></i>{job.position}
                        </span>
                    </div>
                </div>
                
                {/* Nút Ứng tuyển */}
                <div className="mt-6 md:mt-0">
                    <button 
                        onClick={handleApplyClick} 
                        // Disable nút khi đang load profile để người dùng không bấm loạn
                        disabled={isCheckingProfile}
                        className={`font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-md transform hover:-translate-y-1 transition-all ${isCheckingProfile ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-emerald-500 text-white'}`}
                    >
                        {isCheckingProfile ? "Checking..." : t('apply_now', "Ứng tuyển ngay")}
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="flex flex-wrap">
          {/* CỘT TRÁI */}
          <div className="w-full lg:w-8/12 px-4 mb-6">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
              <div className="px-6 py-6">
                
                {/* Hiển thị SKILLS */}
                {job.skills && job.skills.length > 0 && (
                    <div className="mb-6">
                       <h6 className="text-sm font-bold text-blueGray-400 uppercase tracking-wide mb-3">
                           {t('required_skills', "Kỹ năng yêu cầu")}
                       </h6>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map(skill => (
                                <span key={skill.id} className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                 <div className="mb-8">
                    <h6 className="text-sm font-bold text-blueGray-400 uppercase tracking-wide mb-3">
                        {t('job_description', "Mô tả công việc")}
                    </h6>
                    <div className="text-blueGray-600 text-base leading-relaxed whitespace-pre-line bg-blueGray-50 p-4 rounded">
                        {job.description}
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (Sidebar) */}
          <div className="w-full lg:w-4/12 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6">
               <h6 className="text-blueGray-700 font-bold text-sm uppercase border-b pb-2 mb-4">
                   {t('general_info', "Thông tin chung")}
               </h6>
               
               <div className="flex items-start mb-4">
                   <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center mr-3 text-blue-500">
                       <i className="fas fa-calendar-alt"></i>
                   </div>
                   <div>
                       <span className="block text-xs text-blueGray-400 uppercase font-bold">{t('duration', "Thời gian")}</span>
                       <span className="text-blueGray-700 font-semibold">{job.duration || t('unknown', "Không rõ")}</span>
                   </div>
               </div>

               <div className="flex items-start mb-4">
                   <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center mr-3 text-emerald-500">
                        <i className="fas fa-money-bill-wave"></i>
                   </div>
                   <div>
                       <span className="block text-xs text-blueGray-400 uppercase font-bold">{t('salary', "Mức lương")}</span>
                       <span className="text-emerald-600 font-bold">{t('negotiable', "Thỏa thuận")}</span>
                   </div>
               </div>

               <div className="flex items-start mb-4">
                   <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center mr-3 text-red-500">
                       <i className="fas fa-hourglass-end"></i>
                   </div>
                   <div>
                       <span className="block text-xs text-blueGray-400 uppercase font-bold">{t('deadline', "Hạn nộp")}</span>
                       <span className="text-blueGray-700 font-semibold">
                           {job.expiredAt ? new Date(job.expiredAt).toLocaleDateString("vi-VN") : t('no_deadline', "Vô thời hạn")}
                       </span>
                   </div>
               </div>

                <div className="flex items-start mb-4">
                   <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center mr-3 text-orange-500">
                       <i className="fas fa-map-marker-alt"></i>
                   </div>
                   <div>
                       <span className="block text-xs text-blueGray-400 uppercase font-bold">{t('location', "Địa điểm")}</span>
                       <span className="text-blueGray-700 font-semibold">{job.location}</span>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL ỨNG TUYỂN --- */}
      <ApplyJobModal 
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          jobTitle={job.title}
          companyName={job.companyName}
          cvUrl={currentUserProfile?.cvUrl}
          onConfirm={handleConfirmApply}
      />
    </div>
  );
}