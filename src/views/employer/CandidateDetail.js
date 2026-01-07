import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import applyingService from "services/applyingService";
import profileService from "services/profileService";
import cvService from "services/cvService";
import messageService from "services/messageService";
import MiniChatBox from "components/Chat/MiniChatBox";

export default function CandidateDetail() {
  const history = useHistory();
  const { id } = useParams();
  const { t } = useTranslation();
  
  const [application, setApplication] = useState(null);
  const [student, setStudent] = useState(null);
  const [cvUrl, setCvUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal xác nhận (Duyệt/Từ chối)
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [note, setNote] = useState("");

  // --- 3. State cho Chat Box ---
  const [activeChat, setActiveChat] = useState(null);
  // Lấy User hiện tại (Nhà tuyển dụng) từ localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")); 

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        setLoading(true);
        const appRes = await applyingService.getApplicationDetail(id);
        const appPayload = appRes.data.data;

        if (active) setApplication(appPayload);

        if (appPayload && appPayload.studentId) {
          try {
            const profileRes = await profileService.getStudentById(appPayload.studentId);
            let profileData = profileRes.data ? profileRes.data.data : profileRes;

            if (active) {
              setStudent(profileData);
              if (profileData.cvUrl) {
                setCvUrl(profileData.cvUrl);
              }
            }
          } catch (e) {
            console.error("Lỗi tải profile student", e);
          }
        }
      } catch (error) {
        toast.error(t('profile_fetch_error'));
      } finally {
        if (active) setLoading(false);
      }
    }

    if (id) fetchData();

    return () => {
      active = false;
      if (cvUrl && typeof cvUrl === 'string' && cvUrl.startsWith("blob:")) {
        URL.revokeObjectURL(cvUrl);
      }
    };
  }, [id, t]);

  // --- 4. Hàm xử lý khi bấm "Liên hệ ngay" ---
  const handleContact = async () => {
    if (!application || !application.studentId) return;

    try {
        // Tìm hoặc tạo cuộc hội thoại với ứng viên
        const conversation = await messageService.findOrCreateConversation(application.studentId);
        
        // Mở chat box
        setActiveChat({
            conversationId: conversation.id,
            targetUser: {
                id: application.studentId,
                fullName: displayName,
                avatarUrl: displayAvatar
            }
        });
    } catch (error) {
        console.error(error);
        toast.error(t('contact_error') || "Không thể kết nối chat");
    }
  };

  const openConfirmModal = (actionType) => {
    setModalAction(actionType);
    setNote(actionType === "SHORTLISTED" 
        ? "Hồ sơ ấn tượng, mời bạn tham gia phỏng vấn." 
        : "Cảm ơn bạn đã ứng tuyển, nhưng hồ sơ chưa phù hợp.");
    setShowModal(true);
  };

  const handleSubmitStatus = async () => {
    if (!note.trim()) {
        toast.warning(t('note_required_msg') || "Vui lòng nhập ghi chú");
        return;
    }
    try {
        await applyingService.updateStatus(id, modalAction, note);
        setApplication(prev => ({ ...prev, status: modalAction }));
        
        if (modalAction === "SHORTLISTED") toast.success(t('approve_success_msg'));
        else toast.error(t('reject_success_msg'));

        setShowModal(false);
    } catch (error) {
        console.error(error);
        toast.error(t('update_error') || "Có lỗi xảy ra");
    }
  };

  // Render Logic
  if (loading) return <div className="p-10 text-center text-blueGray-500 font-bold">{t('loading')}</div>;
  if (!application) return <div className="p-10 text-center text-red-500">{t('application_not_found')}</div>;

  const studentInfo = student || {};
  const displayName = studentInfo.fullName || studentInfo.name || application.studentName || t('default_candidate_name');
  const displayJob = application.jobTitle || t('default_job_title');
  
  let displayAvatar = require("assets/img/team-1-800x800.jpg").default;
  if (studentInfo.avatarUrl) displayAvatar = studentInfo.avatarUrl;
  else if (studentInfo.avatar) displayAvatar = studentInfo.avatar;
  else if (application.studentAvatar) displayAvatar = application.studentAvatar;

  const displayAddress = studentInfo.address || t('no_address');
  const displayPhone = studentInfo.phone || studentInfo.phoneNumber || t('no_phone');

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-20 relative">
      <div className="container mx-auto px-4">
        
        {/* HEADER & ACTION BAR */}
        <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-xl shadow-lg mb-8 border-l-4 border-emerald-500">
            {/* ... Giữ nguyên phần Header ... */}
            <div className="flex items-center mb-4 md:mb-0">
                <button onClick={() => history.goBack()} className="mr-4 text-blueGray-400 hover:text-blueGray-600">
                    <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-blueGray-700">{displayName}</h2>
                    <p className="text-sm text-blueGray-500">
                        {t('position_label')}: <span className="font-semibold text-emerald-600">{displayJob}</span> 
                        • {t('applied_date_label')}: {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString("vi-VN") : "N/A"}
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                 {/* ... Giữ nguyên các nút Duyệt/Từ chối ... */}
                {(application.status === "SUBMITTED" || application.status === "VIEWED" || application.status === "PENDING") && (
                    <>
                        <button onClick={() => openConfirmModal("REJECTED")} className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none transition-all">
                            <i className="fas fa-times mr-2"></i> {t('reject')}
                        </button>
                        <button onClick={() => openConfirmModal("SHORTLISTED")} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase text-xs px-6 py-2 rounded shadow outline-none transition-all">
                            <i className="fas fa-check mr-2"></i> {t('approve_shortlist')}
                        </button>
                    </>
                )}
                {/* ... Các trạng thái khác giữ nguyên ... */}
                {application.status === "SHORTLISTED" && (
                      <div className="flex items-center text-emerald-600 bg-emerald-100 px-4 py-2 rounded-lg font-bold border border-emerald-200">
                          <i className="fas fa-list-check mr-2"></i> {t('status_shortlisted')}
                      </div>
                )}
                {application.status === "INTERVIEW" && (
                      <div className="flex items-center text-emerald-600 bg-emerald-100 px-4 py-2 rounded-lg font-bold border border-emerald-200">
                          <i className="fas fa-calendar-check mr-2"></i> {t('status_interview_sent')}
                      </div>
                )}
                {application.status === "REJECTED" && (
                      <div className="flex items-center text-red-600 bg-red-100 px-4 py-2 rounded-lg font-bold border border-red-200">
                          <i className="fas fa-user-times mr-2"></i> {t('status_rejected')}
                      </div>
                )}
            </div>
        </div>

        <div className="flex flex-wrap">
            {/* CỘT TRÁI */}
            <div className="w-full lg:w-4/12 px-4 mb-8 lg:mb-0">
                <div className="sticky top-24 space-y-6">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
                        <div className="px-6 py-6">
                            <div className="flex flex-wrap justify-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white -mt-16 bg-white">
                                    <img alt="..." src={displayAvatar} className="w-full h-full object-cover"/>
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <h3 className="text-xl font-semibold text-blueGray-700 mb-2">{displayName}</h3>
                                <div className="text-sm text-blueGray-400 font-bold uppercase">
                                    <i className="fas fa-map-marker-alt mr-2 text-lg"></i> {displayAddress}
                                </div>
                            </div>
                            <div className="mt-6 py-6 border-t border-blueGray-200 flex flex-col space-y-3">
                                <InfoRow icon="fas fa-phone" label="SĐT" value={displayPhone} />
                            </div>
                            
                            {/* --- 5. Nút Liên Hệ Ngay --- */}
                            <div className="mt-6 text-center">
                                <button 
                                    onClick={handleContact}
                                    className="bg-lightBlue-500 text-white w-full py-2 rounded font-bold hover:bg-lightBlue-600 transition block shadow-md hover:shadow-lg"
                                >
                                    <i className="fas fa-comment-dots mr-2"></i> {t('contact_now') || "Liên hệ ngay"}
                                </button>
                            </div>

                        </div>
                    </div>
                    
                    {/* Cover Letter */}
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h4 className="text-lg font-bold text-blueGray-700 mb-3 border-b pb-2">{t('cover_letter')}</h4>
                        <p className="text-blueGray-600 text-sm italic bg-blueGray-50 p-3 rounded border border-blueGray-100">
                            "{application.coverLetter || t('no_cover_letter')}"
                        </p>
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI (CV) - Giữ nguyên */}
            <div className="w-full lg:w-8/12 px-4">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-blueGray-100">
                      <div className="px-6 py-4 bg-blueGray-50 border-b border-blueGray-100 flex justify-between items-center">
                          <div className="flex items-center">
                             <i className="fas fa-file-pdf text-red-500 text-xl mr-3"></i>
                             <h3 className="font-bold text-blueGray-700 text-lg">{t('cv_preview')}</h3>
                          </div>
                          {cvUrl && (
                              <a href={cvUrl} download={`CV_${displayName}.pdf`} target="_blank" rel="noreferrer" className="bg-white border border-blueGray-300 text-blueGray-700 hover:text-emerald-600 text-xs font-bold uppercase px-3 py-2 rounded shadow transition-all">
                                 <i className="fas fa-download mr-1"></i> {t('download')}
                              </a>
                          )}
                      </div>
                    
                      <div className="w-full bg-blueGray-100 relative" style={{ height: "85vh", minHeight: "800px" }}>
                           {cvUrl ? (
                              <iframe src={`${cvUrl}#toolbar=0&navpanes=0&scrollbar=0`} title="CV Preview" className="w-full h-full border-0"/>
                           ) : (
                              <div className="flex h-full items-center justify-center text-blueGray-500">
                                  <div className="text-center">
                                      {application.cvId ? t('downloading_cv') : t('no_cv_candidate')}
                                  </div>
                              </div>
                           )}
                      </div>
                </div>
            </div>
        </div>

        {/* Modal Xác nhận - Giữ nguyên */}
        {showModal && (
            <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-full my-6 mx-auto max-w-lg px-4">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/* ... Phần nội dung Modal giữ nguyên ... */}
                            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                <h3 className="text-2xl font-semibold text-blueGray-700">
                                    {modalAction === "SHORTLISTED" ? (t('confirm_approve_title') || "Xác nhận duyệt") : (t('confirm_reject_title') || "Xác nhận từ chối")}
                                </h3>
                                <button className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => setShowModal(false)}>
                                    <span className="text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                                </button>
                            </div>
                            <div className="relative p-6 flex-auto">
                                <p className="my-2 text-blueGray-500 text-md leading-relaxed">
                                    {modalAction === "SHORTLISTED" 
                                        ? (t('approve_prompt_msg') || "Bạn có muốn duyệt hồ sơ này? Hãy nhập lời nhắn cho ứng viên:") 
                                        : (t('reject_prompt_msg') || "Bạn có chắc chắn từ chối? Hãy nhập lý do:")}
                                </p>
                                <textarea
                                    className="w-full mt-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring shadow-inner"
                                    rows="4"
                                    placeholder={t('enter_note_placeholder') || "Nhập nội dung..."}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                <button className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => setShowModal(false)}>
                                    {t('close') || "Đóng"}
                                </button>
                                <button className={`${modalAction === "SHORTLISTED" ? "bg-emerald-500 active:bg-emerald-600" : "bg-red-500 active:bg-red-600"} text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`} type="button" onClick={handleSubmitStatus}>
                                    {t('confirm') || "Xác nhận"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
        )}

        {/* --- 6. Render Chat Box --- */}
        {activeChat && (
            <MiniChatBox
                conversationId={activeChat.conversationId}
                targetUser={activeChat.targetUser}
                currentUser={currentUser}
                onClose={() => setActiveChat(null)}
            />
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start">
            <div className="w-8 text-center text-blueGray-400"><i className={icon}></i></div>
            <div><span className="text-xs font-bold text-blueGray-400 uppercase block">{label}</span><span className="text-sm font-semibold text-blueGray-700">{value}</span></div>
        </div>
    )
}