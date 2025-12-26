import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import profileService from "services/profileService";
import { toast } from "react-toastify";

import ProfileInfoCard from "components/Profile/ProfileInfoCard";

export default function PublicStudentProfile() {
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await profileService.getStudentById(id);
        
        // Mock tên CV nếu có url để hiển thị đẹp hơn
        if (data.cvUrl) {
            data.cvName = "CV_Dinh_Kem.pdf"; 
        }
        
        setProfile(data);
      } catch (err) {
        console.error(err);
        const errorCode = err.response?.data?.code;
        if (errorCode === "STU_008") {
             setError(t('profile_private_error', "Hồ sơ này đang ở chế độ riêng tư."));
        } else {
             setError(t('profile_fetch_error', "Không thể tải thông tin hồ sơ."));
        }
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProfile();
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-blueGray-100">
        <div className="relative">
             <div className="w-16 h-16 border-4 border-brand border-dotted rounded-full animate-spin"></div>
             <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-brand rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-blueGray-500 font-semibold text-lg">{t('loading', 'Đang tải hồ sơ...')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blueGray-100 px-4">
        <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full border-t-4 border-red-500 transform transition-all hover:scale-105 duration-300">
           <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-lock text-4xl text-red-500"></i>
           </div>
           <h2 className="text-3xl font-bold text-blueGray-800 mb-3">{t('access_denied', "Truy cập bị từ chối")}</h2>
           <p className="text-blueGray-500 mb-8 text-lg leading-relaxed">{error}</p>
           <button 
             onClick={() => history.goBack()}
             className="bg-brand hover:bg-lightBlue-600 text-white font-bold uppercase text-sm px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
           >
             <i className="fas fa-arrow-left mr-2"></i> {t('go_back', "Quay lại")}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-blueGray-100 min-h-screen pb-20">
      
      {/* Background Header Decoration */}
      <div className="absolute top-0 w-full h-96 bg-blueGray-800 transform -skew-y-2 origin-top-left -mt-24 z-0 overflow-hidden">
         <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}></div>
         <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full filter blur-3xl transform translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-32">
        <div className="flex flex-wrap">
          
          {/* CỘT TRÁI: Sidebar (Sticky) */}
          <div className="w-full lg:w-3/12 px-4 mb-8 lg:mb-0">
            <div className="sticky top-24 space-y-6">
                
                {/* 1. Profile Info Card (Thông tin chi tiết) */}
                <div className="transform transition hover:-translate-y-1 duration-300">
                    <ProfileInfoCard profile={profile} />
                </div>

                {/* 2. Contact Card */}
                <div className="bg-white p-6 rounded-xl shadow-xl text-center border border-blueGray-100">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-500">
                        <i className="fas fa-paper-plane text-xl"></i>
                    </div>
                    <h6 className="text-blueGray-700 text-lg font-bold mb-2">{t('contact_student', "Liên hệ ứng viên")}</h6>
                    <p className="text-blueGray-400 text-xs mb-4">Gửi tin nhắn trực tiếp để trao đổi cơ hội việc làm.</p>
                    <button 
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase text-xs px-4 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none transition-all flex items-center justify-center gap-2"
                        onClick={() => toast.info(t('feature_coming_soon', "Tính năng Chat sắp ra mắt!"))}
                    >
                        <i className="fas fa-comment-dots text-lg"></i> {t('send_message', "Nhắn tin ngay")}
                    </button>
                </div>
            </div>
          </div>

          {/* CỘT PHẢI: Nội dung chính (Chỉ hiện CV) */}
          <div className="w-full lg:w-8/12 px-4">
             <div className="flex flex-col gap-8">
                
                {/* IFRAME HIỂN THỊ CV */}
                {profile.cvUrl ? (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-blueGray-100">
                        {/* Header của CV Preview */}
                        <div className="px-6 py-4 bg-blueGray-50 border-b border-blueGray-100 flex justify-between items-center">
                             <div className="flex items-center">
                                <i className="fas fa-file-pdf text-red-500 text-xl mr-3"></i>
                                <h3 className="font-bold text-blueGray-700 text-lg">CV Preview</h3>
                             </div>
                             
                             <a 
                                href={profile.cvUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs font-bold uppercase px-3 py-2 bg-white border border-blueGray-200 rounded text-blueGray-600 hover:text-brand hover:border-brand transition shadow-sm flex items-center"
                             >
                                <i className="fas fa-download mr-2"></i> Tải xuống
                             </a>
                        </div>
                        
                        {/* Phần hiển thị Iframe - Đã sửa chiều cao */}
                        <div className="w-full bg-blueGray-100 relative" style={{ height: "85vh", minHeight: "800px" }}>
                             <iframe 
                                src={`${profile.cvUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                title="CV Preview"
                                className="w-full h-full border-0"
                                height="100%"
                             >
                                 <div className="flex flex-col items-center justify-center h-full text-blueGray-500">
                                     <p>Trình duyệt không hỗ trợ xem trước PDF.</p>
                                     <a href={profile.cvUrl} className="text-brand font-bold underline mt-2">
                                         Tải CV về máy
                                     </a>
                                 </div>
                             </iframe>
                        </div>
                    </div>
                ) : (
                    /* Fallback khi không có CV */
                    <div className="text-center py-20 bg-white rounded-xl shadow border border-dashed border-blueGray-300">
                        <div className="bg-blueGray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-file-upload text-3xl text-blueGray-400"></i>
                        </div>
                        <h3 className="text-xl font-bold text-blueGray-600">Chưa có CV nào được tải lên</h3>
                        <p className="text-blueGray-400 mt-2">Ứng viên này chưa công khai CV của họ.</p>
                    </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}