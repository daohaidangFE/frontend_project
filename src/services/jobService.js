// src/services/jobService.js
import apiClient from "./apiClient";

const JOB_API_URL = "/internship-post"; 
const PROFILE_API_URL = "/profile/v1"; 

const unwrap = (response) => response.data?.data || response.data?.result || response.data;

const jobService = {
  searchJobs: async (keyword = "", workMode = "", location = "", skillId = "", companyId = "", page = 0, size = 10) => {
    const params = { 
        keyword,
        page,
        size
    };

    if (workMode && workMode !== "ALL") params.workMode = workMode;
    if (location) params.location = location;
    if (skillId) params.skillId = skillId;
    if (companyId) params.companyId = companyId;

    const response = await apiClient.get(`${JOB_API_URL}/search`, { params });
    
    return unwrap(response); 
  },
  getJobDetail: async (postId) => {
    const response = await apiClient.get(`${JOB_API_URL}/detail`, {
      params: { postId }
    });
    let jobData = unwrap(response);

    if (jobData && jobData.companyId && !jobData.companyName) {
      try {
        const companyRes = await apiClient.get(`${PROFILE_API_URL}/companies/${jobData.companyId}`);
        const companyData = unwrap(companyRes);
        jobData.companyName = companyData?.name || "Công ty ẩn danh";
      } catch (err) {
        jobData.companyName = "Công ty ẩn danh";
      }
    }
    return jobData;
  },

  getEmployerJobDetail: async (postId) => {
    const response = await apiClient.get(`${JOB_API_URL}/employer/detail`, {
      params: { postId }
    });
    return unwrap(response);
  },

  updateJob: async (postId, jobData) => {
    const response = await apiClient.put(`${JOB_API_URL}/update`, jobData, {
      params: { postId }
    });
    return unwrap(response);
  },

  getMyPosts: (page = 0, size = 10) => {
    return apiClient.get("/internship-post/employer/my-posts", {
      params: {
        page: page,
        size: size
      }
    });
  },

  getApplicationDetail: async (applicationId) => {
    const response = await apiClient.get(`/applications/${applicationId}`);
    return response.data?.data || response.data?.result || response.data;
  },

  getAdminJobDetail: async (postId) => {
    const response = await apiClient.get(`${JOB_API_URL}/admin/detail`, {
      params: { postId }
    });
    
    let jobData = unwrap(response);

    if (jobData && jobData.companyId && !jobData.companyName) {
      try {
        const companyRes = await apiClient.get(`${PROFILE_API_URL}/companies/${jobData.companyId}`);
        const companyData = unwrap(companyRes);
        jobData.companyName = companyData?.name || "Công ty ẩn danh";
        
        if (!jobData.companyLogo && companyData?.logo) {
             jobData.companyLogo = companyData.logo;
        }
      } catch (err) {
        jobData.companyName = "Công ty ẩn danh";
      }
    }
    
    return jobData;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await apiClient.put(`/applications/${applicationId}/status`, null, {
        params: { status }
    });
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await apiClient.post(`${JOB_API_URL}/create`, jobData);
    return unwrap(response);
  },

  getPendingPosts: async () => {
    const response = await apiClient.get(`${JOB_API_URL}/admin/pending`);
    return unwrap(response) || [];
  },

  getRejectedAndHiddenPosts: async () => {
    const response = await apiClient.get(`${JOB_API_URL}/rejected-hidden`);
    return unwrap(response) || [];
  },

  getStudentPublicProfile: async (studentId) => {
    const response = await apiClient.get(`${PROFILE_API_URL}/${studentId}`);
    return response.data?.data || response.data;
  },

  approvePost: async (postId) => {

    const response = await apiClient.patch(`${JOB_API_URL}/approve`, null, {
      params: { postId }
    });
    return unwrap(response);
  },

  rejectPost: async (postId) => {
    const response = await apiClient.patch(`${JOB_API_URL}/reject`, null, {
      params: { postId }
    });
    return unwrap(response);
  },

  hidePost: async (postId) => {
    const response = await apiClient.patch(`${JOB_API_URL}/hide`, null, {
      params: { postId }
    });
    return unwrap(response);
  }
};

export default jobService;