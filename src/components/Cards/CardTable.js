import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import jobService from "services/jobService";
import AdminPostDetailModal from "components/Modals/AdminPostDetailModal.js"; // Tận dụng lại Modal xịn xò lúc nãy

export default function AdminAllJobsTable({ color = "light" }) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal chi tiết
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load dữ liệu khi vào trang
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await jobService.searchJobs("", "", "", "", "", 0, 20); 
      setPosts(data.content || data); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Xem chi tiết (Tương tự trang Approval)
  const onViewDetail = async (summaryPost) => {
    try {
      const fullPostData = await jobService.getAdminJobDetail(summaryPost.id);
      setSelectedPost(fullPostData);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(t('fetch_detail_error', 'Không thể tải chi tiết'));
    }
  };
  const onHidePost = async (postId) => {
    Swal.fire({
      title: t('confirm_hide_title', 'Xác nhận ẩn bài?'),
      text: t('confirm_hide_text', 'Bài viết sẽ không còn hiển thị với sinh viên.'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: t('hide', 'Ẩn ngay'),
      cancelButtonText: t('cancel', 'Hủy')
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await jobService.hidePost(postId);
          toast.success(t('success', 'Đã ẩn bài viết'));
          fetchData();
        } catch (error) {
          toast.error(t('error', 'Có lỗi xảy ra'));
        }
      }
    });
  };

  // Hàm render trạng thái cho đẹp
  const renderStatus = (status) => {
    let colorClass = "text-blueGray-500";
    let icon = "fas fa-circle";
    let label = status;

    switch (status) {
      case 'ACTIVE':
        colorClass = "text-emerald-500";
        icon = "fas fa-check-circle";
        break;
      case 'PENDING':
        colorClass = "text-orange-500";
        break;
      case 'REJECTED':
        colorClass = "text-red-500";
        icon = "fas fa-times-circle";
        break;
      case 'HIDDEN':
        colorClass = "text-blueGray-400";
        icon = "fas fa-eye-slash";
        break;
      default:
        break;
    }

    return (
      <div className={`flex items-center font-bold ${colorClass}`}>
        <i className={`${icon} mr-2 text-xs`}></i> {label}
      </div>
    );
  };

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                {t('all_job_posts', 'Danh sách toàn bộ tin tuyển dụng')}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('job_info', 'Tin tuyển dụng')}
                </th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('salary', 'Mức lương')}
                </th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('status', 'Trạng thái')}
                </th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('action', 'Hành động')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="4" className="text-center py-10"><i className="fas fa-spinner fa-spin mr-2"></i> Loading...</td></tr>
              ) : posts.length === 0 ? (
                 <tr><td colSpan="4" className="text-center py-10">Không có dữ liệu</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-100 transition duration-150">
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className={"h-12 w-12 bg-white rounded-full border flex justify-center items-center overflow-hidden mr-3"}>
                          {post.companyLogo ? (
                             <img src={post.companyLogo} alt="..." className="h-full w-full object-contain" />
                          ) : (
                             <i className="fas fa-building text-lg text-blueGray-400"></i>
                          )}
                        </span>
                        <div className="flex flex-col">
                           <span className={"font-bold " + (color === "light" ? "text-blueGray-600" : "text-white")}>
                              {post.title}
                           </span>
                           <span className="text-xs text-blueGray-400">{post.companyName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {post.salary}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {renderStatus(post.status)}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                       <button 
                          onClick={() => onViewDetail(post)}
                          className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                       >
                          {t('view', 'Xem')}
                       </button>
                       {post.status === 'ACTIVE' && (
                         <button 
                            onClick={() => onHidePost(post.id)}
                            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                         >
                            <i className="fas fa-eye-slash"></i>
                         </button>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminPostDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
        onApprove={() => {}} 
        onReject={() => {}}
      />
    </>
  );
}

AdminAllJobsTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};