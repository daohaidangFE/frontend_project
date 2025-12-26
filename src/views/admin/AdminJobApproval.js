import React, { useEffect, useState } from "react";
import jobService from "services/jobService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AdminPostDetailModal from "components/Modals/AdminPostDetailModal.js";

export default function AdminJobApproval() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await jobService.getPendingPosts();
      setPendingPosts(data);
    } catch (error) {
      toast.error("🚀 Không thể tải danh sách bài đăng!");
    } finally {
      setLoading(false);
    }
  };

  const onViewDetail = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const onApprove = async (postId) => {
    Swal.fire({
      title: "Phê duyệt bài đăng?",
      text: "Tin tuyển dụng này sẽ được hiển thị công khai cho sinh viên.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đồng ý, duyệt ngay!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await jobService.approvePost(postId);
          setPendingPosts(prev => prev.filter(p => p.id !== postId));
          setIsModalOpen(false);
          toast.success("✅ Đã phê duyệt bài đăng thành công!");
        } catch (error) {
          toast.error("❌ Phê duyệt thất bại!");
        }
      }
    });
  };

  const onReject = async (postId) => {
    Swal.fire({
      title: "Từ chối bài đăng?",
      text: "Bạn có chắc chắn muốn từ chối phê duyệt bài đăng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Đúng, từ chối!",
      cancelButtonText: "Quay lại",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await jobService.rejectPost(postId);
          setPendingPosts(prev => prev.filter(p => p.id !== postId));
          setIsModalOpen(false);
          toast.info("📋 Đã từ chối bài đăng.");
        } catch (error) {
          toast.error("❌ Thao tác thất bại!");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-blueGray-500">
        <i className="fas fa-spinner fa-spin mr-2"></i>
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="p-6 bg-blueGray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">

        {/* Header */}
        <h2 className="text-xl font-bold mb-6 border-b pb-3 text-blueGray-700 flex items-center">
          <i className="fas fa-clipboard-check mr-2 text-emerald-500"></i>
          Danh sách bài đăng chờ phê duyệt
        </h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blueGray-50 text-blueGray-500 uppercase text-xs font-bold">
                <th className="px-5 py-3 border-b">Thông tin bài đăng</th>
                <th className="px-5 py-3 border-b">Địa điểm</th>
                <th className="px-5 py-3 border-b">Ngày tạo</th>
                <th className="px-5 py-3 border-b text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {pendingPosts.length > 0 ? (
                pendingPosts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => onViewDetail(post)}
                    className="hover:bg-blueGray-50 transition cursor-pointer"
                  >
                    <td className="px-5 py-4 border-b">
                      <div className="font-semibold text-blueGray-700">
                        {post.title}
                      </div>
                      <div className="text-xs text-blueGray-500 mt-1">
                        {post.position}
                      </div>
                    </td>

                    <td className="px-5 py-4 border-b text-sm text-blueGray-600">
                      <i className="fas fa-map-marker-alt mr-1 text-blueGray-300"></i>
                      {post.location}
                    </td>

                    <td className="px-5 py-4 border-b text-sm text-blueGray-600">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    <td
                      className="px-5 py-4 border-b text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onApprove(post.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full shadow text-xs font-bold uppercase mr-2 transition"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => onReject(post.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow text-xs font-bold uppercase transition"
                      >
                        Từ chối
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-16 text-blueGray-400">
                    <i className="fas fa-inbox text-3xl mb-3 block"></i>
                    Không có bài đăng nào cần phê duyệt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AdminPostDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
        onApprove={onApprove}
        onReject={onReject}
      />
    </div>
  );
}
