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
  
  // Cập nhật trạng thái (Duyệt/Từ chối)
  // Gửi status qua params để khớp với @RequestParam trong Spring Boot
  updateStatus: (applicationId, status) => {
    return apiClient.put(`/applying/v1/employer/applications/${applicationId}/status`, null, {
        params: { status } 
    });
  }
};

export default applyingService;