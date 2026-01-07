import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import jobService from "services/jobService";
import AdminPostViewModal from "components/Modals/AdminPostViewModal.js";

export default function AdminRejectedHiddenJobsTable({ color = "light" }) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await jobService.getRejectedAndHiddenPosts();
      setPosts(data);
    } catch (error) {
      toast.error(t('fetch_error', 'Lỗi khi tải danh sách bài lưu trữ'));
    } finally {
      setLoading(false);
    }
  };

  const onViewDetail = async (summaryPost) => {
    try {
      const fullPostData = await jobService.getAdminJobDetail(summaryPost.id);
      setSelectedPost(fullPostData);
      setIsModalOpen(true);
    } catch (error) {
      toast.error(t('fetch_detail_error', 'Không thể tải chi tiết'));
    }
  };

  const renderStatus = (status) => {
    let colorClass = status === 'REJECTED' ? "text-red-500" : "text-blueGray-400";
    let icon = status === 'REJECTED' ? "fas fa-times-circle" : "fas fa-eye-slash";
    return (
      <div className={`flex items-center font-bold ${colorClass}`}>
        <i className={`${icon} mr-2 text-xs`}></i> {status}
      </div>
    );
  };

  return (
    <>
      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " + 
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}>
        
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className={"font-semibold text-lg " + (color === "light" ? "text-blueGray-700" : "text-white")}>
                {t('archive_jobs', 'Thùng rác & Bài viết đã ẩn')}
              </h3>
            </div>
          </div>
        </div>

        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " + 
                  (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('job_info', 'Tin tuyển dụng')}
                </th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " + 
                  (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('status', 'Trạng thái')}
                </th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right " + 
                  (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}>
                  {t('action', 'Hành động')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="text-center py-10"><i className="fas fa-spinner fa-spin mr-2"></i> Loading...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-10 text-blueGray-400">Không có bài viết nào bị từ chối hoặc ẩn</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-100 transition duration-150 border-b">
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <div className="flex flex-col">
                          <span className="font-bold text-blueGray-600">{post.title}</span>
                          <span className="text-xs text-blueGray-400">{post.companyName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {renderStatus(post.status)}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      <button 
                        onClick={() => onViewDetail(post)}
                        className="bg-blueGray-700 text-white font-bold uppercase text-xs px-3 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1"
                      >
                        {t('view', 'Xem')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminPostViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
      />
    </>
  );
}