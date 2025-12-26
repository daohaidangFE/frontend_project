import React from "react";
import { Link } from "react-router-dom";

export default function EmployerDashboard() {
  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        
        {/* --- 1. STATS CARDS (Thống kê) --- */}
        <div className="flex flex-wrap mb-12">
           <StatCard 
              title="Tin đang tuyển" 
              value="3" 
              icon="fas fa-briefcase" 
              color="bg-orange-500" 
              desc="Java Backend, ReactJS, Tester"
           />
           <StatCard 
              title="CV mới nhận" 
              value="18" 
              icon="fas fa-file-alt" 
              color="bg-pink-500" 
              desc="+5 CV trong hôm nay"
           />
           <StatCard 
              title="Lịch phỏng vấn" 
              value="4" 
              icon="fas fa-calendar-check" 
              color="bg-lightBlue-500" 
              desc="Sắp tới: 14:00 chiều nay"
           />
           <StatCard 
              title="Tỷ lệ chuyển đổi" 
              value="65%" 
              icon="fas fa-chart-pie" 
              color="bg-emerald-500" 
              desc="Khá tốt so với tháng trước"
           />
        </div>

        {/* --- 2. BẢNG ỨNG VIÊN MỚI NHẤT --- */}
        <div className="w-full mb-12">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="rounded-t mb-0 px-6 py-4 border-b border-blueGray-100 bg-blueGray-50">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-bold text-lg text-blueGray-700">
                    <i className="fas fa-user-clock mr-2 text-blueGray-400"></i>
                    Ứng viên chờ duyệt mới nhất
                  </h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <button
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                  >
                    Xem tất cả
                  </button>
                </div>
              </div>
            </div>
            
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                      Họ và tên
                    </th>
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                      Vị trí ứng tuyển
                    </th>
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                      Thời gian nộp
                    </th>
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                      Trạng thái
                    </th>
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-bold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* --- MOCK DATA SÁT THỰC TẾ --- */}
                  
                  {/* 1. Ứng viên vừa nộp (Main Flow) */}
                  <CandidateRow 
                    name="Đào Hải Đăng"
                    avatar="https://randomuser.me/api/portraits/men/32.jpg" 
                    position="Java Backend Intern"
                    date="Vừa xong"
                    status="PENDING"
                  />

                  {/* 2. Ứng viên nữ, Frontend */}
                  <CandidateRow 
                    name="Lê Thị Minh Anh"
                    avatar="https://randomuser.me/api/portraits/women/44.jpg"
                    position="Frontend ReactJS Fresher"
                    date="2 giờ trước"
                    status="PENDING"
                  />

                  {/* 3. Ứng viên đang xem xét */}
                  <CandidateRow 
                    name="Phạm Văn Khoa"
                    avatar="https://randomuser.me/api/portraits/men/85.jpg"
                    position="DevOps Engineer"
                    date="Hôm qua, 14:30"
                    status="REVIEWING"
                  />

                  {/* 4. Ứng viên đã phỏng vấn */}
                  <CandidateRow 
                    name="Hoàng Thu Trang"
                    avatar="https://randomuser.me/api/portraits/women/68.jpg"
                    position="Business Analyst Intern"
                    date="16/12/2025"
                    status="INTERVIEWED"
                  />
                  
                  {/* 5. Ứng viên Tester */}
                  <CandidateRow 
                    name="Vũ Đức Thắng"
                    avatar="https://randomuser.me/api/portraits/men/11.jpg"
                    position="Manual Tester"
                    date="15/12/2025"
                    status="REJECTED"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTS CON ---

function StatCard({ title, value, icon, color, desc }) {
    return (
        <div className="w-full lg:w-3/12 px-4 mb-4 lg:mb-0">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg hover:-translate-y-1 transform transition-all duration-300">
                <div className="flex-auto p-4">
                    <div className="flex flex-wrap">
                        <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                            <h5 className="text-blueGray-400 uppercase font-bold text-xs">{title}</h5>
                            <span className="font-semibold text-xl text-blueGray-700">{value}</span>
                        </div>
                        <div className="relative w-auto pl-4 flex-initial">
                            <div className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ${color}`}>
                                <i className={icon}></i>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-blueGray-400 mt-4">
                        <span className="text-emerald-500 mr-2"><i className="fas fa-arrow-up"></i></span>
                        <span className="whitespace-nowrap">{desc}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

function CandidateRow({ name, avatar, position, date, status }) {
    // Logic màu sắc trạng thái
    let statusClass = "bg-blueGray-100 text-blueGray-600 border-blueGray-200";
    let statusText = "Không rõ";

    switch(status) {
        case 'PENDING':
            statusClass = "bg-orange-100 text-orange-600 border-orange-200";
            statusText = "Chờ duyệt";
            break;
        case 'REVIEWING':
            statusClass = "bg-lightBlue-100 text-lightBlue-600 border-lightBlue-200";
            statusText = "Đang xem xét";
            break;
        case 'INTERVIEWED':
            statusClass = "bg-purple-100 text-purple-600 border-purple-200";
            statusText = "Đã phỏng vấn";
            break;
        case 'REJECTED':
            statusClass = "bg-red-100 text-red-600 border-red-200";
            statusText = "Đã từ chối";
            break;
        default: break;
    }

    return (
        <tr className="hover:bg-blueGray-50 transition-colors border-b border-blueGray-100 last:border-none">
            <td className="px-6 align-middle text-xs whitespace-nowrap p-4 text-left flex items-center">
                 <div className="w-10 h-10 rounded-full bg-blueGray-200 flex items-center justify-center mr-3 overflow-hidden shadow-sm shrink-0">
                    {avatar ? (
                         <img src={avatar} alt="..." className="w-full h-full object-cover" />
                    ) : (
                         <i className="fas fa-user text-white"></i>
                    )}
                 </div>
                 <span className="font-bold text-blueGray-700 text-sm">{name}</span>
            </td>
            <td className="px-6 align-middle text-xs whitespace-nowrap p-4">
                <span className="font-semibold text-blueGray-600">{position}</span>
            </td>
            <td className="px-6 align-middle text-xs whitespace-nowrap p-4">
                 <i className="far fa-clock mr-2 text-blueGray-400"></i> {date}
            </td>
            <td className="px-6 align-middle text-xs whitespace-nowrap p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusClass}`}>
                    {statusText}
                </span>
            </td>
            <td className="px-6 align-middle text-xs whitespace-nowrap p-4">
                 {/* Nút hành động */}
                 <div className="flex gap-2">
                    <Link to="/employer/candidates/1" className="bg-lightBlue-500 hover:bg-lightBlue-600 text-white font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150" title="Xem chi tiết CV">
                        <i className="fas fa-eye"></i>
                    </Link>
                    
                    {status === 'PENDING' && (
                        <>
                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150" title="Duyệt hồ sơ">
                                <i className="fas fa-check"></i>
                            </button>
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150" title="Từ chối">
                                <i className="fas fa-times"></i>
                            </button>
                        </>
                    )}
                 </div>
            </td>
        </tr>
    )
}