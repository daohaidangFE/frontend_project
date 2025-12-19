import apiClient from "./apiClient";

const JOB_API_URL = "/internship-post";

const jobService = {
  // 1. Tìm kiếm công việc
  searchJobs: async (keyword = "", workMode = "ALL", location = "", skillId = "") => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (workMode && workMode !== "ALL") params.workMode = workMode;
    if (location) params.location = location;
    if (skillId) params.skillId = skillId;

    const response = await apiClient.get(`${JOB_API_URL}/search`, { params });
    // Bóc tách dữ liệu linh hoạt cho các cấu trúc response khác nhau
    return response.data?.data?.items || response.data?.data || [];
  },

  // 2. Lấy chi tiết công việc (ĐÃ TỐI ƯU: Tự động lấy tên công ty)
  getJobDetail: async (postId) => {
    const response = await apiClient.get(`${JOB_API_URL}/detail`, {
      params: { postId }
    });
    
    let jobData = response.data?.data || response.data?.result || response.data;

    // Nếu có công ty mà chưa có tên (chỉ có ID), tự động gọi API lấy tên
    if (jobData.companyId && !jobData.companyName) {
      try {
        const companyRes = await apiClient.get(`/companies/${jobData.companyId}`);
        jobData.companyName = companyRes.data?.name || companyRes.data?.data?.name || "Công ty ẩn danh";
      } catch (err) {
        console.warn("Không thể lấy thông tin công ty:", err);
        jobData.companyName = "Công ty ẩn danh";
      }
    }
    return jobData;
  },

  // 3. Ứng tuyển công việc (MỚI THÊM)
  // applyJob: async (payload) => {
  //   try {
  //     // Giả định endpoint ứng tuyển là /applications/apply
  //     const response = await apiClient.post(`/applications/apply`, payload);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Lỗi ứng tuyển tại Service:", error);
  //     throw error;
  //   }
  // },

  // 4. Tạo bài đăng (Employer)
  createJob: async (jobData) => {
    const response = await apiClient.post(`${JOB_API_URL}/create`, jobData);
    return response.data?.data || response.data;
  },

  // 5. Lấy danh sách bài đăng theo công ty
  getJobsByCompany: async (companyId) => {
    const response = await apiClient.get(`${JOB_API_URL}/search`, {
      params: { companyId }
    });
    return response.data?.data?.items || response.data?.data || [];
  },

  // 6. Admin: Lấy danh sách chờ duyệt
  getPendingPosts: async () => {
    try {
      const response = await apiClient.get(`${JOB_API_URL}/admin/pending`);
      return response.data?.data || [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chờ duyệt:", error);
      throw error;
    }
  },

  // 7. Admin: Phê duyệt bài
  approvePost: async (postId) => {
    try {
      const response = await apiClient.patch(`${JOB_API_URL}/approve`, null, {
        params: { postId }
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi phê duyệt bài:", error);
      throw error;
    }
  },

  // 8. Admin: Từ chối bài
  rejectPost: async (postId) => {
    try {
      const response = await apiClient.patch(`${JOB_API_URL}/reject`, null, {
        params: { postId }
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi từ chối bài:", error);
      throw error;
    }
  }
};

export default jobService;