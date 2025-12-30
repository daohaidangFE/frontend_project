import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import profileService from "services/profileService";

export default function PublicStudentProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const data = await profileService.getStudentById(id);
        setProfile(data);
      } catch (error) {
        console.error("Lỗi tải public profile:", error);
        toast.error(t("profile.not_found", "Không tìm thấy hồ sơ."));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPublicData();
  }, [id, t]);

  if (loading) return <div className="p-10 text-center text-blueGray-500 font-bold">Loading Profile...</div>;
  if (!profile) return <div className="p-10 text-center text-red-500 font-bold">Profile not found</div>;

  return (
    <>
      {/* 1. HEADER BACKGROUND */}
      <div className="relative pt-12 pb-12 flex content-center items-center justify-center bg-blueGray-800">
         <div className="absolute top-0 w-full h-full bg-center bg-cover opacity-30" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&auto=format&fit=crop&w=2710&q=80')" }}>
         </div>
         <div className="container relative mx-auto text-center z-10">
              <h1 className="text-white font-bold text-3xl">{t("profile.public_view", "Hồ sơ ứng viên")}</h1>
         </div>
      </div>

      {/* 2. MAIN LAYOUT (SPLIT) */}
      <div className="bg-blueGray-100 min-h-screen py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">

            {/* === CỘT TRÁI: THÔNG TIN CÁ NHÂN === */}
            <div className="w-full lg:w-4/12 px-4 mb-8 lg:mb-0">
               <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded-lg sticky top-24">
                  <div className="px-6 py-8">
                     
                     {/* Avatar & Name */}
                     <div className="text-center mb-6">
                        <div className="relative inline-block">
                           {profile.avatarUrl ? (
                               <img alt="Avatar" src={profile.avatarUrl} className="shadow-xl rounded-full h-32 w-32 align-middle border-none object-cover mx-auto bg-white" />
                           ) : (
                               <div className="shadow-xl rounded-full h-32 w-32 mx-auto bg-blueGray-200 flex items-center justify-center text-blueGray-400 border-4 border-white">
                                   <i className="fas fa-user text-4xl"></i>
                               </div>
                           )}
                        </div>
                        <h3 className="text-2xl font-bold leading-normal text-blueGray-700 mt-4 mb-1">
                          {profile.fullName}
                        </h3>
                        <p className="text-sm font-bold uppercase text-blueGray-400">
                          {profile.headline || "Sinh viên thực tập"}
                        </p>
                     </div>

                     {/* Contact Info */}
                     <div className="border-t border-blueGray-200 py-4">
                        <div className="flex items-center mb-3 text-blueGray-600 font-medium">
                           <div className="w-8 text-center mr-2"><i className="fas fa-map-marker-alt text-lg"></i></div>
                           <span>{profile.address || "Chưa cập nhật địa chỉ"}</span>
                        </div>
                        {/* Email đang ẩn vì API chưa trả về, nếu có thì uncomment */}
                        {/* <div className="flex items-center mb-3 text-blueGray-600 font-medium">
                           <div className="w-8 text-center mr-2"><i className="fas fa-envelope text-lg"></i></div>
                           <span className="break-all">{profile.email || "Email ẩn"}</span>
                        </div> */}
                        <div className="flex items-center mb-3 text-blueGray-600 font-medium">
                           <div className="w-8 text-center mr-2"><i className="fas fa-phone text-lg"></i></div>
                           <span>{profile.phone || "SĐT ẩn"}</span>
                        </div>
                     </div>

                     {/* Bio */}
                     <div className="border-t border-blueGray-200 py-4">
                        <h6 className="text-blueGray-500 text-sm font-bold uppercase mb-3">Giới thiệu</h6>
                        <p className="text-blueGray-600 text-base leading-relaxed text-justify whitespace-pre-line">
                           {profile.bio || "Sinh viên chưa cập nhật phần giới thiệu."}
                        </p>
                     </div>

                     {/* Nút Liên hệ */}
                     <div className="mt-6 text-center">
                        <button
                           className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full block transition-all transform hover:-translate-y-1"
                           type="button"
                           onClick={() => toast.info(t("feature.coming_soon", "Tính năng nhắn tin đang được phát triển!"))}
                        >
                           <i className="fas fa-paper-plane mr-2"></i> {t("profile.contact", "Liên hệ ngay")}
                        </button>
                        <p className="text-xs text-blueGray-400 mt-2 italic">
                           Gửi tin nhắn trực tiếp đến ứng viên
                        </p>
                     </div>

                  </div>
               </div>
            </div>

            {/* === CỘT PHẢI: HIỂN THỊ CV (TRANSPARENT & CLEAN) === */}
            <div className="w-full lg:w-8/12 px-4">
                <div className="flex flex-col min-w-0 break-words w-full mb-6 sticky top-24">
                   
                   {/* Header Clean */}
                   <div className="flex justify-between items-center mb-3 px-1">
                      <h3 className="font-bold text-lg text-blueGray-700 flex items-center">
                         <i className="fas fa-file-pdf mr-2 text-red-500"></i> Hồ Sơ Đính Kèm
                      </h3>
                      
                      <a 
                         href={profile.cvUrl} 
                         target="_blank" 
                         rel="noreferrer"
                         className="text-xs font-bold uppercase py-2 px-4 rounded-full text-blueGray-600 bg-white border border-blueGray-200 hover:bg-blueGray-50 hover:text-lightBlue-600 transition-all shadow-sm hover:shadow-md flex items-center"
                      >
                         <i className="fas fa-external-link-alt mr-2"></i> Mở trong tab mới
                      </a>
                   </div>

                   {/* Khung CV (Trong suốt, tắt toolbar) */}
                   {profile.cvUrl ? (
                      <div className="relative w-full rounded-lg shadow-2xl overflow-hidden bg-transparent">
                          <div style={{ height: '85vh', width: '100%' }}> 
                             <object
                                // Thêm tham số: #toolbar=0 (tắt menu), navpanes=0 (tắt sidebar), view=FitH (zoom vừa chiều ngang)
                                data={`${profile.cvUrl}#toolbar=0&navpanes=0&view=FitH`}
                                type="application/pdf"
                                className="w-full h-full block rounded-lg"
                             >
                                {/* Fallback cho trình duyệt không hỗ trợ */}
                                <div className="flex flex-col items-center justify-center h-full bg-white text-center p-8 border border-blueGray-200 rounded-lg">
                                   <div className="bg-blueGray-50 p-4 rounded-full mb-4">
                                      <i className="fas fa-file-pdf text-4xl text-red-500"></i>
                                   </div>
                                   <h4 className="text-xl font-bold text-blueGray-700 mb-2">
                                      Trình duyệt không hỗ trợ xem trực tiếp
                                   </h4>
                                   <p className="text-blueGray-500 mb-4">Bạn có thể tải xuống để xem chi tiết.</p>
                                   <a 
                                      href={profile.cvUrl} 
                                      className="bg-lightBlue-600 text-white font-bold py-2 px-6 rounded-full shadow hover:shadow-lg transition-all"
                                      target="_blank" 
                                      rel="noreferrer"
                                   >
                                      <i className="fas fa-download mr-2"></i> Tải xuống CV
                                   </a>
                                </div>
                             </object>
                          </div>
                      </div>
                   ) : (
                      // Fallback khi chưa có CV
                      <div className="w-full h-96 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center text-blueGray-400 border-2 border-dashed border-blueGray-300">
                            <i className="fas fa-cloud-upload-alt text-6xl mb-4 opacity-50"></i>
                            <p className="text-lg font-semibold">Ứng viên chưa cập nhật CV</p>
                      </div>
                   )}

                </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}