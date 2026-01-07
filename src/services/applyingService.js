import apiClient from "./apiClient";

const applyingService = {
  // Nộp đơn ứng tuyển
  applyJob: (data) => {
    return apiClient.post("/applying/v1/apply", data);
  },

  // Lấy lịch sử ứng tuyển của Student
  getMyApplications: () => {
    return apiClient.get("/applying/v1/student/my-applications");
  },

  // Lấy chi tiết đơn ứng tuyển (cho Employer)
  getApplicationDetail: (applicationId) => {
    return apiClient.get(`/applying/v1/employer/applications/${applicationId}`);
  },

  // Lấy danh sách ứng viên theo Job ID
  getApplicationsByJobId: (jobPostId, page = 0, size = 10) => {
    return apiClient.get(`/applying/v1/employer/posts/${jobPostId}/applications`, {
      params: { page, size }
    });
  },
  
  // Cập nhật trạng thái đơn (Duyệt/Từ chối)
  updateStatus: (applicationId, status, note = "") => {
    return apiClient.patch(`/applying/v1/employer/applications/${applicationId}/status`, {
        status: status,
        note: note
    });
  },

  // Lấy thống kê Dashboard
  getDashboardStats: (jobPostIds) => {
    return apiClient.post("/applying/v1/stats", jobPostIds);
  }
};

export default applyingService;