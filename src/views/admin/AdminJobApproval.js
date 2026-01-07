import React, { useEffect, useState } from "react";
import jobService from "services/jobService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AdminPostDetailModal from "components/Modals/AdminPostDetailModal.js";
import { useTranslation } from 'react-i18next';

export default function AdminJobApproval() {
  const { t } = useTranslation();
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
      console.log("Dữ liệu Pending Posts:", data);
      if (data.length > 0) {
          console.log("Skill của bài đầu tiên:", data[0].skills);
      }
      setPendingPosts(data);
    } catch (error) {
      toast.error(t('error')); 
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
        toast.error(t('fetch_detail_error'));
      }
  };

  const onApprove = async (postId) => {
    Swal.fire({
      title: t('confirm_approve_title'),
      text: t('confirm_approve_text'),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await jobService.approvePost(postId);
          setPendingPosts(prev => prev.filter(p => p.id !== postId));
          setIsModalOpen(false);
          toast.success(`✅ ${t('approve_success')}`);
        } catch (error) {
          toast.error(`❌ ${t('approve_error')}`);
        }
      }
    });
  };

  const onReject = async (postId) => {
    Swal.fire({
      title: t('confirm_reject_title'),
      text: t('confirm_reject_text'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#64748b",
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await jobService.rejectPost(postId);
          setPendingPosts(prev => prev.filter(p => p.id !== postId));
          setIsModalOpen(false);
          toast.info(`📋 ${t('reject_success')}`);
        } catch (error) {
          toast.error(`❌ ${t('reject_error')}`);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-blueGray-500">
        <i className="fas fa-spinner fa-spin mr-2"></i>
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="p-6 bg-blueGray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">

        {/* Header */}
        <h2 className="text-xl font-bold mb-6 border-b pb-3 text-blueGray-700 flex items-center">
          <i className="fas fa-clipboard-check mr-2 text-emerald-500"></i>
          {t('manage_job_posts')} 
        </h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blueGray-50 text-blueGray-500 uppercase text-xs font-bold">
                <th className="px-5 py-3 border-b">{t('job_info_header')}</th>
                <th className="px-5 py-3 border-b">{t('location')}</th>
                <th className="px-5 py-3 border-b">{t('created_at')}</th>
                <th className="px-5 py-3 border-b text-center">{t('action_header')}</th>
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
                        {t('approve')}
                      </button>
                      
                      <button
                        onClick={() => onReject(post.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow text-xs font-bold uppercase transition"
                      >
                        {t('reject')}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-16 text-blueGray-400">
                    <i className="fas fa-inbox text-3xl mb-3 block"></i>
                    {t('no_pending_posts')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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