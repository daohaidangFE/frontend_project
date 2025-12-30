import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Services
import applyingService from "services/applyingService";
import profileService from "services/profileService";
import cvService from "services/cvService"; 

export default function CandidateDetail() {
  const history = useHistory();
  const { id } = useParams(); // Lấy Application ID từ URL
  
  const [application, setApplication] = useState(null);
  const [student, setStudent] = useState(null);
  const [cvUrl, setCvUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true; 

    async function fetchData() {
      try {
        setLoading(true);

        // =========================================================
        // BƯỚC 1: LẤY THÔNG TIN ĐƠN ỨNG TUYỂN ĐỂ CÓ STUDENT ID
        // =========================================================
        const appRes = await applyingService.getApplicationDetail(id);
        
        // Xử lý dữ liệu trả về từ API (thường nằm trong .data.data nếu dùng ApiResponse)
        const appPayload = appRes.data && appRes.data.data ? appRes.data.data : appRes.data; 
        
        console.log("🔥 1. Đã lấy được Application Data:", appPayload);
        
        if (active) setApplication(appPayload);

        // =========================================================
        // BƯỚC 2: CÓ STUDENT ID -> GỌI API LẤY CHI TIẾT PROFILE
        // =========================================================
        if (appPayload && appPayload.studentId) {
            try {
                console.log("🚀 2. Bắt đầu gọi Profile cho ID:", appPayload.studentId);
                
                // Gọi hàm getStudentById (Đúng tên hàm trong service của bạn)
                const profileRes = await profileService.getStudentById(appPayload.studentId);
                
                // Xử lý dữ liệu trả về (kiểm tra xem có bọc trong ApiResponse không)
                let profileData = profileRes;
                if (profileRes.data) {
                    profileData = profileRes.data.data || profileRes.data;
                }
                
                console.log("✅ 3. Đã lấy được Profile Data:", profileData);

                if (active) {
                    setStudent(profileData);
                    
                    // =================================================
                    // BƯỚC 3: XỬ LÝ CV (Ưu tiên Link -> Blob)
                    // =================================================
                    if (profileData.cvUrl) {
                        console.log("📄 Dùng Link CV từ Profile:", profileData.cvUrl);
                        setCvUrl(profileData.cvUrl);
                    } 
                    // Fallback: Nếu Profile chưa có link, dùng Blob từ CV Service
                    else if (appPayload.cvId) {
                        console.log("⬇️ Đang tải CV Blob...");
                        try {
                            const blobUrl = await cvService.previewCV(appPayload.cvId);
                            setCvUrl(blobUrl);
                        } catch (err) {
                             console.warn("Lỗi tải CV blob:", err);
                        }
                    }
                }
            } catch (e) {
                console.warn("⚠️ Lỗi khi tải Profile (có thể do Private):", e);
            }
        } else {
            console.warn("❌ Không tìm thấy Student ID trong đơn ứng tuyển");
        }

      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu chung:", error);
        toast.error("Không thể tải thông tin hồ sơ.");
      } finally {
        if (active) setLoading(false);
      }
    }
    
    if (id) fetchData();

    // Cleanup: Thu hồi URL blob để tránh rò rỉ bộ nhớ
    return () => {
        active = false;
        if (cvUrl && typeof cvUrl === 'string' && cvUrl.startsWith("blob:")) {
            URL.revokeObjectURL(cvUrl);
        }
    };
  }, [id]);

  // --- Handlers: Duyệt / Từ chối ---
  const handleApprove = async () => {
    try {
        await applyingService.updateStatus(id, "INTERVIEW");
        setApplication(prev => ({ ...prev, status: "INTERVIEW" }));
        toast.success("Đã duyệt hồ sơ! Đã gửi email mời phỏng vấn.");
    } catch (error) {
        toast.error("Lỗi khi duyệt hồ sơ.");
    }
  };

  const handleReject = async () => {
    if(window.confirm("Bạn có chắc chắn muốn từ chối ứng viên này?")) {
        try {
            await applyingService.updateStatus(id, "REJECTED");
            setApplication(prev => ({ ...prev, status: "REJECTED" }));
            toast.error("Đã từ chối hồ sơ.");
        } catch (error) {
            toast.error("Lỗi khi từ chối hồ sơ.");
        }
    }
  };

  if (loading) return <div className="p-10 text-center text-blueGray-500 font-bold">Đang tải dữ liệu...</div>;
  if (!application) return <div className="p-10 text-center text-red-500">Không tìm thấy đơn ứng tuyển.</div>;
  
  // --- CHUẨN BỊ DỮ LIỆU HIỂN THỊ (Fallback an toàn) ---
  const studentInfo = student || {}; 
  
  // Tên: Ưu tiên Profile -> Application -> Mặc định
  const displayName = studentInfo.fullName || studentInfo.name || application.studentName || "Tên ứng viên";
  const displayJob = application.jobTitle || "Vị trí tuyển dụng";
  
  // Avatar
  let displayAvatar = require("assets/img/team-1-800x800.jpg").default;
  if (studentInfo.avatarUrl) displayAvatar = studentInfo.avatarUrl;
  else if (studentInfo.avatar) displayAvatar = studentInfo.avatar;
  else if (application.studentAvatar) displayAvatar = application.studentAvatar;

  // Info khác
  const displayAddress = studentInfo.address || "Chưa cập nhật địa chỉ";
  const displayEmail = studentInfo.email || "Chưa hiển thị email";
  const displayPhone = studentInfo.phone || studentInfo.phoneNumber || "Chưa hiển thị SĐT";

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        
        {/* --- 1. HEADER & ACTION BAR --- */}
        <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-xl shadow-lg mb-8 border-l-4 border-emerald-500">
            <div className="flex items-center mb-4 md:mb-0">
                <button onClick={() => history.goBack()} className="mr-4 text-blueGray-400 hover:text-blueGray-600">
                    <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-blueGray-700">{displayName}</h2>
                    <p className="text-sm text-blueGray-500">
                        Vị trí: <span className="font-semibold text-emerald-600">{displayJob}</span> 
                        • Ngày nộp: {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString("vi-VN") : "N/A"}
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                {application.status === "PENDING" && (
                    <>
                        <button onClick={handleReject} className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none transition-all">
                            <i className="fas fa-times mr-2"></i> Từ chối
                        </button>
                        <button onClick={handleApprove} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase text-xs px-6 py-2 rounded shadow outline-none transition-all">
                            <i className="fas fa-check mr-2"></i> Duyệt & Mời PV
                        </button>
                    </>
                )}
                {application.status === "INTERVIEW" && (
                      <div className="flex items-center text-emerald-600 bg-emerald-100 px-4 py-2 rounded-lg font-bold border border-emerald-200">
                         <i className="fas fa-calendar-check mr-2"></i> Đã gửi lời mời phỏng vấn
                      </div>
                )}
                {application.status === "REJECTED" && (
                      <div className="flex items-center text-red-600 bg-red-100 px-4 py-2 rounded-lg font-bold border border-red-200">
                         <i className="fas fa-user-times mr-2"></i> Hồ sơ bị loại
                      </div>
                )}
            </div>
        </div>

        <div className="flex flex-wrap">
            {/* --- 2. CỘT TRÁI: THÔNG TIN ỨNG VIÊN --- */}
            <div className="w-full lg:w-4/12 px-4 mb-8 lg:mb-0">
                <div className="sticky top-24 space-y-6">
                    {/* Card Avatar & Contact */}
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
                                {/* <InfoRow icon="fas fa-envelope" label="Email" value={displayEmail} /> */}
                                <InfoRow icon="fas fa-phone" label="SĐT" value={displayPhone} />
                            </div>
                            <div className="mt-6 text-center">
                                <a href={`/profile/${application.studentId}`} target="_blank" rel="noreferrer" className="bg-lightBlue-500 text-white w-full py-2 rounded font-bold hover:bg-lightBlue-600 transition block">
                                    <i className="fas fa-external-link-alt mr-2"></i> Xem trang cá nhân
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Card Cover Letter (Thư xin việc) */}
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h4 className="text-lg font-bold text-blueGray-700 mb-3 border-b pb-2">Thư xin việc</h4>
                        <p className="text-blueGray-600 text-sm italic bg-blueGray-50 p-3 rounded border border-blueGray-100">
                            "{application.coverLetter || "Không có thư xin việc."}"
                        </p>
                    </div>
                </div>
            </div>

            {/* --- 3. CỘT PHẢI: XEM CV --- */}
            <div className="w-full lg:w-8/12 px-4">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-blueGray-100">
                      <div className="px-6 py-4 bg-blueGray-50 border-b border-blueGray-100 flex justify-between items-center">
                          <div className="flex items-center">
                             <i className="fas fa-file-pdf text-red-500 text-xl mr-3"></i>
                             <h3 className="font-bold text-blueGray-700 text-lg">CV Preview</h3>
                          </div>
                          {cvUrl && (
                              <a href={cvUrl} download={`CV_${displayName}.pdf`} target="_blank" rel="noreferrer" className="bg-white border border-blueGray-300 text-blueGray-700 hover:text-emerald-600 text-xs font-bold uppercase px-3 py-2 rounded shadow transition-all">
                                 <i className="fas fa-download mr-1"></i> Tải về
                              </a>
                          )}
                     </div>
                    
                    {/* KHUNG IFRAME - Dùng iframe chuẩn */}
                    <div className="w-full bg-blueGray-100 relative" style={{ height: "85vh", minHeight: "800px" }}>
                         {cvUrl ? (
                             <iframe 
                                src={`${cvUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                                title="CV Preview" 
                                className="w-full h-full border-0"
                                height="100%"
                             >
                                <div className="flex flex-col items-center justify-center h-full text-blueGray-500">
                                     <p>Trình duyệt không hỗ trợ xem trước PDF.</p>
                                     <a href={cvUrl} className="text-brand font-bold underline mt-2">Tải CV về máy</a>
                                </div>
                             </iframe>
                         ) : (
                             <div className="flex h-full items-center justify-center text-blueGray-500">
                                 <div className="text-center">
                                     {application.cvId ? "Đang tải CV..." : "Ứng viên không nộp CV."}
                                 </div>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// Component phụ hiển thị dòng thông tin
function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start">
            <div className="w-8 text-center text-blueGray-400"><i className={icon}></i></div>
            <div><span className="text-xs font-bold text-blueGray-400 uppercase block">{label}</span><span className="text-sm font-semibold text-blueGray-700">{value}</span></div>
        </div>
    )
}