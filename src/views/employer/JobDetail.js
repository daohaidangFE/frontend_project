import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import jobService from "services/jobService";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import skillService from "services/skillService";
// Import Modal
import ConfirmModal from "components/Modals/ConfirmModal";

export default function JobDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho Modal xác nhận
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
      title: "",
      message: "",
      isDanger: false,
      confirmText: "Đồng ý", // Default text
      onConfirmAction: null
  });

  // ===== LOAD DATA =====
  useEffect(() => {
    fetchJobDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      
      let data = await jobService.getEmployerJobDetail(id);      
      
      // Logic fallback tên skill (giữ nguyên code của bạn)
      if (data.skills && data.skills.length > 0) {
          const missingNameSkills = data.skills.filter(s => !s.skillName && !s.name);
          
          if (missingNameSkills.length > 0) {
              const skillIds = data.skills.map(s => s.skillId);
              try {
                  const skillInfos = await skillService.getSkillsBatch(skillIds);
                  data.skills = data.skills.map(s => {
                      const found = skillInfos.find(info => info.id === s.skillId);
                      return found ? { ...s, skillName: found.name } : s;
                  });
              } catch (err) {
                  console.error("Lỗi khi fetch tên skill:", err);
              }
          }
      }
      setJob(data);
    } catch (error) {
      console.error("Lỗi tải chi tiết:", error);
      toast.error(t("load_error", "Không thể tải thông tin bài đăng.")); 
    } finally {
      setLoading(false);
    }
  };

  // ===== XỬ LÝ CLICK NÚT ẨN/HIỆN (MỚI) =====
  const handleHideClick = () => {
    if (!job) return;

    const isHidden = job.status === 'HIDDEN';

    // Cấu hình nội dung cho Modal
    setModalConfig({
        title: isHidden ? "Hiện bài đăng?" : "Ẩn bài đăng?",
        message: isHidden 
            ? "Bài đăng sẽ được chuyển sang trạng thái chờ duyệt (PENDING)." 
            : "Sinh viên sẽ không thể tìm thấy bài đăng này nữa.",
        isDanger: !isHidden, // Nếu là Ẩn thì cảnh báo đỏ, Hiện thì xanh
        confirmText: isHidden ? "Đồng ý hiện" : "Đồng ý ẩn",
        
        // Hành động khi bấm nút Đồng ý trong Modal
        onConfirmAction: async () => {
            try {
                await jobService.hidePost(id);
                toast.success(t("action_success", "Thao tác thành công!"));
                setShowConfirmModal(false); // Đóng modal
                fetchJobDetail(); // Reload lại dữ liệu
            } catch (error) {
                toast.error(t("action_error", "Có lỗi xảy ra."));
            }
        }
    });

    // Mở modal
    setShowConfirmModal(true);
  };

  // Helper hiển thị màu trạng thái
  const getStatusBadge = (status) => {
    const styles = {
      ACTIVE: "bg-emerald-200 text-emerald-700 border border-emerald-300",
      PENDING: "bg-orange-200 text-orange-700 border border-orange-300",
      HIDDEN: "bg-blueGray-200 text-blueGray-600 border border-blueGray-300",
      REJECTED: "bg-red-200 text-red-700 border border-red-300"
    };
    return styles[status] || "bg-blueGray-200 text-blueGray-600";
  };

  // Helper dịch trạng thái
  const translateStatus = (status) => {
      const map = {
          ACTIVE: "Đang hiển thị",
          PENDING: "Đang chờ duyệt",
          HIDDEN: "Đã ẩn",
          REJECTED: "Bị từ chối",
          EXPIRED: "Đã hết hạn"
      };
      return map[status] || status;
  }

  if (loading) return (
      <div className="flex justify-center items-center h-64">
          <i className="fas fa-spinner fa-spin text-3xl text-blueGray-400"></i>
      </div>
  );
  
  if (!job) return <div className="p-10 text-center text-red-500 font-bold">Không tìm thấy bài đăng.</div>;

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
      
      {/* HEADER & ACTIONS */}
      <div className="rounded-t bg-white mb-0 px-6 py-6 border-b border-blueGray-200">
        <div className="flex flex-wrap items-center justify-between">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <button 
                onClick={() => history.goBack()}
                className="text-blueGray-400 hover:text-blueGray-700 text-sm font-bold uppercase mb-2 transition-colors"
            >
                <i className="fas fa-arrow-left mr-2"></i> Quay lại danh sách
            </button>
            <h6 className="text-blueGray-700 text-xl font-bold mt-1">
              {job.title}
            </h6>
            <span className={`text-xs font-bold inline-block py-1 px-3 rounded mt-2 ${getStatusBadge(job.status)}`}>
              {translateStatus(job.status)}
            </span>
          </div>
          
          <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right flex justify-end gap-2">
             {/* Nút Xem ứng viên */}
             <Link 
                to={`/employer/posts/${job.id}/applications`}
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center"
             >
                <i className="fas fa-users mr-2"></i> Xem Ứng viên
             </Link>

             {/* Nút Sửa bài */}
             {job.status !== 'EXPIRED' && (
                  <Link
                      to={`/employer/jobs/${job.id}/edit`}
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center"
                  >
                      <i className="fas fa-edit mr-2"></i> Sửa bài
                  </Link>
             )}

             {/* Nút Ẩn bài (Sử dụng handleHideClick mới) */}
             {job.status !== 'REJECTED' && (
                 <button
                    onClick={handleHideClick}
                    className={`${job.status === 'HIDDEN' ? 'bg-blueGray-500' : 'bg-red-500'} text-white active:opacity-80 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center`}
                 >
                    <i className={`fas ${job.status === 'HIDDEN' ? 'fa-eye' : 'fa-eye-slash'} mr-2`}></i> 
                    {job.status === 'HIDDEN' ? 'Hiện bài' : 'Ẩn bài'}
                 </button>
             )}
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        
        {/* BANNER CẢNH BÁO TRẠNG THÁI */}
        {job.status !== 'ACTIVE' && (
            <div className="mt-6 bg-orange-50 border-l-4 border-orange-500 text-orange-700 p-4 rounded" role="alert">
                <p className="font-bold">Chế độ xem của Nhà tuyển dụng</p>
                <p className="text-sm">
                    Bài đăng này hiện đang ở trạng thái <strong>{translateStatus(job.status)}</strong> và chưa hiển thị công khai với sinh viên.
                </p>
            </div>
        )}

        {/* Hàng 1: Thông tin chung */}
        <h6 className="text-blueGray-400 text-sm mt-8 mb-6 font-bold uppercase border-b pb-2">
          Thông tin chung
        </h6>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4 mb-4">
            <span className="text-sm font-bold text-blueGray-500 block uppercase">Vị trí</span>
            <span className="text-base text-blueGray-700 font-semibold">{job.position}</span>
          </div>
          <div className="w-full lg:w-6/12 px-4 mb-4">
            <span className="text-sm font-bold text-blueGray-500 block uppercase">Hình thức</span>
            <span className="text-base text-blueGray-700">
                {job.workMode === 'ONSITE' ? 'Tại văn phòng' : job.workMode === 'REMOTE' ? 'Làm từ xa' : 'Linh hoạt'}
            </span>
          </div>
          <div className="w-full lg:w-6/12 px-4 mb-4">
            <span className="text-sm font-bold text-blueGray-500 block uppercase">Địa điểm</span>
            <span className="text-base text-blueGray-700">{job.location}</span>
          </div>
          <div className="w-full lg:w-6/12 px-4 mb-4">
             <span className="text-sm font-bold text-blueGray-500 block uppercase">Thời gian thực tập</span>
             <span className="text-base text-blueGray-700">{job.duration || "Thỏa thuận"}</span>
          </div>
          <div className="w-full lg:w-6/12 px-4 mb-4">
             <span className="text-sm font-bold text-blueGray-500 block uppercase">Ngày tạo</span>
             <span className="text-base text-blueGray-700">
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : ''}
             </span>
          </div>
        </div>

        {/* Hàng 2: Kỹ năng */}
        <h6 className="text-blueGray-400 text-sm mt-6 mb-6 font-bold uppercase border-b pb-2">
          Yêu cầu kỹ năng
        </h6>
        <div className="px-4 mb-4">
           {job.skills && job.skills.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                   {job.skills.map((s, index) => (
                       <span key={s.id || index} className="bg-lightBlue-100 text-lightBlue-800 text-xs font-bold px-3 py-1 rounded-full border border-lightBlue-200">
                           {s.skillName || s.name} 
                           {s.importanceLevel && (
                               <span className="ml-1 text-lightBlue-600 text-[10px] uppercase">
                                  • {s.importanceLevel}
                               </span>
                           )}
                       </span>
                   ))}
               </div>
           ) : (
               <p className="text-sm text-blueGray-500 italic">Không có yêu cầu kỹ năng cụ thể.</p>
           )}
        </div>

        {/* Hàng 3: Mô tả */}
        <h6 className="text-blueGray-400 text-sm mt-6 mb-6 font-bold uppercase border-b pb-2">
          Mô tả chi tiết
        </h6>
        <div className="px-4">
            <div className="text-blueGray-700 text-base whitespace-pre-line leading-relaxed bg-blueGray-50 p-4 rounded border border-blueGray-100">
                {job.description || "Chưa có mô tả."}
            </div>
        </div>

      </div>

      {/* 👇 COMPONENT MODAL NHÚNG VÀO ĐÂY */}
      <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={modalConfig.onConfirmAction}
          title={modalConfig.title}
          message={modalConfig.message}
          isDanger={modalConfig.isDanger}
          confirmText={modalConfig.confirmText}
      />
    </div>
  );
}