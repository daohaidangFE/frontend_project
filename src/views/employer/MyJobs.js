import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Services
import jobService from "services/jobService";

// Helper format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export default function MyJobs() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State phân trang
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10 
  });

  const fetchMyPosts = async (page = 0) => {
    setIsLoading(true);
    try {
      const res = await jobService.getMyPosts(page, pagination.size);
      const responseData = res.data?.data || res.data?.result || res; 
      
      const content = responseData.content || responseData; 

      if (responseData.content) {
          setPosts(responseData.content);
          setPagination(prev => ({
             ...prev,
             pageNumber: responseData.number,
             totalPages: responseData.totalPages,
             totalElements: responseData.totalElements
          }));
      } else if (Array.isArray(content)) {
          setPosts(content);
      }

    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchMyPosts(newPage);
    }
  };

  return (
    <div className="relative bg-blueGray-100 min-h-screen pt-12 pb-20">
      <div className="px-4 md:px-10 mx-auto w-full">
        
        {/* --- PHẦN THỐNG KÊ (Placeholder - Có thể thêm các Card thống kê ở đây sau) --- */}
        <div className="flex flex-wrap">
           {/* Ví dụ: Tổng số bài đăng, Tổng số ứng viên... */}
        </div>

        {/* --- BẢNG QUẢN LÝ TIN TUYỂN DỤNG --- */}
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            
                {/* Header Bảng */}
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                      <h3 className="font-semibold text-lg text-blueGray-700">
                        <i className="fas fa-briefcase mr-2"></i>
                        Quản lý tin tuyển dụng ({pagination.totalElements})
                      </h3>
                    </div>
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                      <Link
                        to="/employer/create-job"
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      >
                        <i className="fas fa-plus mr-1"></i> Đăng tin mới
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Nội dung Bảng */}
                <div className="block w-full overflow-x-auto">
                  <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          Tên công việc
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          Trạng thái
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          Ngày đăng
                        </th>
                        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                          Hành động
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {isLoading ? (
                         <tr><td colSpan="4" className="text-center py-8">Đang tải dữ liệu...</td></tr>
                      ) : posts.length === 0 ? (
                         <tr><td colSpan="4" className="text-center py-8">Bạn chưa đăng tin tuyển dụng nào.</td></tr>
                      ) : (
                        posts.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                            
                            {/* 1. Tên công việc */}
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              <Link to={`/employer/jobs/${job.id}`} className="font-bold text-blueGray-700 hover:text-indigo-600 block text-sm">
                                {job.title}
                              </Link>
                              <div className="text-blueGray-400 text-xs mt-1">{job.position}</div>
                            </td>

                            {/* 2. Trạng thái */}
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                               <i className={`fas fa-circle mr-2 ${
                                job.status === 'ACTIVE' ? 'text-emerald-500' : 
                                job.status === 'PENDING' ? 'text-orange-500' : 
                                job.status === 'REJECTED' ? 'text-red-500' : 'text-blueGray-400'
                              }`}></i> 
                              {job.status}
                            </td>

                            {/* 3. Ngày tạo */}
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              {formatDate(job.createdAt)}
                            </td>

                            {/* 4. Hành động */}
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              {/* Nút Chi tiết */}
                              <Link 
                                to={`/employer/jobs/${job.id}`}
                                className="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 ease-linear transition-all duration-150"
                                title="Xem chi tiết & Thao tác"
                              >
                                <i className="fas fa-info-circle"></i>
                              </Link>

                              {/* Nút Xem Ứng Viên */}
                              <Link 
                                to={`/employer/posts/${job.id}/applications`}
                                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                title="Xem danh sách ứng viên"
                              >
                                <i className="fas fa-users"></i>
                              </Link>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer Bảng (Pagination) */}
                {!isLoading && pagination.totalPages > 1 && (
                  <div className="rounded-b py-3 px-4 border-t border-blueGray-100 bg-blueGray-50 flex justify-end items-center gap-2">
                     <span className="text-xs font-semibold text-blueGray-600 mr-2">
                       Trang {pagination.pageNumber + 1} / {pagination.totalPages}
                     </span>
                     <button
                        disabled={pagination.pageNumber === 0}
                        onClick={() => handlePageChange(pagination.pageNumber - 1)}
                        className={`px-3 py-1 rounded text-xs font-bold uppercase ${pagination.pageNumber === 0 ? 'bg-gray-200 text-gray-400' : 'bg-white text-indigo-500 border border-indigo-500 hover:bg-indigo-500 hover:text-white'}`}
                     >
                        Trước
                     </button>
                     <button
                        disabled={pagination.pageNumber >= pagination.totalPages - 1}
                        onClick={() => handlePageChange(pagination.pageNumber + 1)}
                        className={`px-3 py-1 rounded text-xs font-bold uppercase ${pagination.pageNumber >= pagination.totalPages - 1 ? 'bg-gray-200 text-gray-400' : 'bg-white text-indigo-500 border border-indigo-500 hover:bg-indigo-500 hover:text-white'}`}
                     >
                        Sau
                     </button>
                  </div>
                )}

              </div>
            </div>
        </div>
      </div>
    </div>
  );
}