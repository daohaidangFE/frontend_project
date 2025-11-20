import apiClient from "./apiClient";

// Base API (qua API Gateway → job-service)
const JOB_API_URL = "/internship-post";

const jobService = {
  searchJobs: async (keyword = "", workMode = null) => {
    const params = { keyword };
    if (workMode) params.workMode = workMode;

    const response = await apiClient.get(`${JOB_API_URL}/search`, { params });
    return response.data.data;
  },

  // Lấy chi tiết tin tuyển dụng
  getJobDetail: async (postId) => {
    const response = await apiClient.get(`${JOB_API_URL}/detail`, {
      params: { postId }
    });
    return response.data.data;
  },

  // Đăng tin tuyển dụng
  createJob: async (employerId, jobData) => {
    const response = await apiClient.post(`${JOB_API_URL}/create`, jobData, {
      params: { employerId }
    });
    return response.data.data;
  },

  // Lấy danh sách tin đã đăng của công ty sau khi đăng xong
  getJobsByCompany: async (companyId) => {
      const response = await apiClient.get(`${JOB_API_URL}/search`, {
          params: { companyId }
      });
      return response.data.data;
   }
};

export default jobService;
