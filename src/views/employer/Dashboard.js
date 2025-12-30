import React from "react";
import { Link } from "react-router-dom";

export default function EmployerDashboard() {
  return (
    <>
      <div className="flex flex-wrap">
        {/* CARD 1: Tin đang hiển thị */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title="Tin đang hiển thị"
            value="3"
            icon="fas fa-briefcase"
            color="bg-emerald-500"
            footer="2 tin đang chờ duyệt"
            footerIcon="fas fa-clock"
            footerColor="text-orange-500"
          />
        </div>

        {/* CARD 2: Ứng viên mới */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title="Ứng viên mới"
            value="12"
            icon="fas fa-users"
            color="bg-lightBlue-500"
            footer="Tăng 15% so với tuần trước"
            footerIcon="fas fa-arrow-up"
            footerColor="text-emerald-500"
          />
        </div>

        {/* CARD 3: Sắp hết hạn */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title="Sắp hết hạn"
            value="1"
            icon="fas fa-hourglass-half"
            color="bg-orange-500"
            footer="Hết hạn trong 3 ngày tới"
            footerIcon="fas fa-exclamation-triangle"
            footerColor="text-red-500"
          />
        </div>

        {/* CARD 4: Tổng lượt xem (Giả định) */}
        <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
          <StatCard 
            title="Tổng lượt xem"
            value="450"
            icon="fas fa-chart-bar"
            color="bg-red-500"
            footer="Cập nhật 1 giờ trước"
            footerIcon="fas fa-sync"
            footerColor="text-blueGray-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap mt-4">
        {/* CỘT TRÁI: Ứng viên mới nhất */}
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    Ứng viên mới nộp hồ sơ
                  </h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <Link
                    to="/employer/dashboard" // Sau này trỏ tới trang All Candidates
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    Xem tất cả
                  </Link>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto">
              {/* Bảng ứng viên rút gọn */}
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Tên ứng viên
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Vị trí ứng tuyển
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Ngày nộp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      Nguyễn Văn A
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      Frontend Intern
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      Vừa xong
                    </td>
                  </tr>
                  <tr>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      Trần Thị B
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      Java Backend
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      1 giờ trước
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* CỘT PHẢI: Shortcut hoặc tin tức */}
        <div className="w-full xl:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    Phím tắt
                  </h3>
                </div>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-3">
                <Link to="/employer/create-job" className="w-full bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-center uppercase">
                    <i className="fas fa-plus-circle mr-2"></i> Đăng tin mới
                </Link>
                <Link to="/employer/my-jobs" className="w-full bg-lightBlue-500 text-white font-bold text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 text-center uppercase">
                    <i className="fas fa-list mr-2"></i> Quản lý tin
                </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Component con hiển thị thẻ thống kê
function StatCard({ title, value, icon, color, footer, footerIcon, footerColor }) {
    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                  <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                    {title}
                  </h5>
                  <span className="font-semibold text-xl text-blueGray-700">
                    {value}
                  </span>
                </div>
                <div className="relative w-auto pl-4 flex-initial">
                  <div
                    className={
                      "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " +
                      color
                    }
                  >
                    <i className={icon}></i>
                  </div>
                </div>
              </div>
              <p className="text-sm text-blueGray-400 mt-4">
                <span className={footerColor + " mr-2"}>
                  <i className={footerIcon}></i> {footer}
                </span>
              </p>
            </div>
          </div>
    )
}