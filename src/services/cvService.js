import apiClient from "./apiClient";

const CV_API_URL = "/cv/v1"; 

const unwrap = (response) => response.data;

const cvService = {
  // 1. Upload CV
  uploadCV: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cvName", file.name); 

    const response = await apiClient.post(`${CV_API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap(response);
  },

  // 2. Lấy danh sách CV
  getMyCVs: async () => {
    const response = await apiClient.get(`${CV_API_URL}/my-cvs`);
    return unwrap(response);
  },

  // 3. Xóa CV
  deleteCV: async (cvId) => {
    const response = await apiClient.delete(`${CV_API_URL}/${cvId}`);
    return unwrap(response);
  },

  // 4. Đặt CV mặc định
  setDefaultCV: async (cvId) => {
    const response = await apiClient.put(`${CV_API_URL}/${cvId}/set-default`);
    return unwrap(response);
  },

  // 5. Đổi tên CV
  updateCvName: async (cvId, newName) => {
    const response = await apiClient.put(`${CV_API_URL}/${cvId}`, {
        newCvName: newName
    });
    return unwrap(response);
  },

  // 6. Lấy chi tiết (để lấy link download/preview)
  getCvDetail: async (cvId) => {
      const response = await apiClient.get(`${CV_API_URL}/${cvId}`);
      return unwrap(response);
  }
};

export default cvService;