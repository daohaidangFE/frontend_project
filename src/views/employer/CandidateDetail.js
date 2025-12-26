import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function CandidateDetail() {
  const history = useHistory();
  
  // State giả lập trạng thái hồ sơ để Demo
  const [status, setStatus] = useState("PENDING"); // PENDING, INTERVIEW, REJECTED

  // Dữ liệu Mock (Khớp với Đào Hải Đăng ở Dashboard)
  const candidate = {
    id: 1,
    name: "Đào Hải Đăng",
    position: "Java Backend Intern",
    email: "daohaidangpc@gmail.com",
    phone: "0911.608.047",
    address: "Ninh Bình, Việt Nam",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    appliedDate: "24/12/2025",
    cvUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Link PDF mẫu
    coverLetter: "Em là sinh viên năm cuối PTIT, có kinh nghiệm làm Java Spring Boot qua các bài tập lớn. Em mong muốn được thực tập tại công ty để học hỏi thêm..."
  };

  // Xử lý hành động
  const handleApprove = () => {
    // Gọi API update status ở đây...
    setStatus("INTERVIEW");
    toast.success("Đã duyệt hồ sơ! Đã gửi email mời phỏng vấn.");
  };

  const handleReject = () => {
    if(window.confirm("Bạn có chắc chắn muốn từ chối ứng viên này?")) {
        setStatus("REJECTED");
        toast.error("Đã từ chối hồ sơ.");
    }
  };

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        
        {/* --- 1. HEADER & ACTION BAR (Quan trọng nhất của Employer) --- */}
        <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-xl shadow-lg mb-8 border-l-4 border-brand">
            <div className="flex items-center mb-4 md:mb-0">
                <button onClick={() => history.goBack()} className="mr-4 text-blueGray-400 hover:text-blueGray-600">
                    <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-blueGray-700">{candidate.name}</h2>
                    <p className="text-sm text-blueGray-500">
                        Ứng tuyển: <span className="font-semibold text-brand">{candidate.position}</span> • {candidate.appliedDate}
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                {/* Hiển thị nút dựa theo trạng thái */}
                {status === "PENDING" && (
                    <>
                        <button 
                            onClick={handleReject}
                            className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                        >
                            <i className="fas fa-times mr-2"></i> Từ chối
                        </button>
                        <button 
                            onClick={handleApprove}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase text-xs px-6 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                        >
                            <i className="fas fa-check mr-2"></i> Duyệt & Mời PV
                        </button>
                    </>
                )}

                {status === "INTERVIEW" && (
                     <div className="flex items-center text-emerald-600 bg-emerald-100 px-4 py-2 rounded-lg font-bold border border-emerald-200">
                        <i className="fas fa-calendar-check mr-2"></i> Đã gửi lời mời phỏng vấn
                     </div>
                )}

                {status === "REJECTED" && (
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
                                    <img alt="..." src={candidate.avatar} className="w-full h-full object-cover"/>
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                                    {candidate.name}
                                </h3>
                                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                                    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
                                    {candidate.address}
                                </div>
                            </div>
                            <div className="mt-6 py-6 border-t border-blueGray-200 ">
                                <div className="flex flex-col space-y-3">
                                    <InfoRow icon="fas fa-envelope" label="Email" value={candidate.email} />
                                    <InfoRow icon="fas fa-phone" label="SĐT" value={candidate.phone} />
                                    <InfoRow icon="fas fa-clock" label="Ngày nộp" value={candidate.appliedDate} />
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <button className="bg-lightBlue-500 text-white w-full py-2 rounded font-bold hover:bg-lightBlue-600 transition">
                                    <i className="fas fa-comment-dots mr-2"></i> Nhắn tin
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card Cover Letter (Thư xin việc) */}
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h4 className="text-lg font-bold text-blueGray-700 mb-3 border-b pb-2">Thư xin việc</h4>
                        <p className="text-blueGray-600 text-sm italic bg-blueGray-50 p-3 rounded border border-blueGray-100">
                            "{candidate.coverLetter}"
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
                         <a 
                            href={candidate.cvUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-white border border-blueGray-300 text-blueGray-700 hover:text-brand hover:border-brand text-xs font-bold uppercase px-3 py-2 rounded shadow outline-none focus:outline-none transition-all"
                         >
                            <i className="fas fa-download mr-1"></i> Tải về
                         </a>
                    </div>
                    
                    {/* Khung hiển thị PDF (Tỷ lệ 85vh như bên Student) */}
                    <div className="w-full bg-blueGray-100 relative" style={{ height: "85vh", minHeight: "800px" }}>
                         <iframe 
                            src={`${candidate.cvUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="CV Preview"
                            className="w-full h-full border-0"
                         >
                         </iframe>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start">
            <div className="w-8 flex-shrink-0 text-center text-blueGray-400">
                <i className={icon}></i>
            </div>
            <div>
                <span className="text-xs font-bold text-blueGray-400 uppercase block">{label}</span>
                <span className="text-sm font-semibold text-blueGray-700">{value}</span>
            </div>
        </div>
    )
}