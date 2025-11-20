import apiClient from "./apiClient";

// Gateway route → cv-service (/api/cv/** → /api/cv/v1)
const CV_API_URL = "/cv/v1";

const cvService = {
  /** Upload CV (PDF/DOCX) */
  uploadCV: async (file, cvName) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cvName", cvName || file.name);

    const response = await apiClient.post(`${CV_API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /** Lấy danh sách CV của người dùng */
  getMyCVs: async () => {
    const response = await apiClient.get(`${CV_API_URL}/my-cvs`);
    return response.data;
  },

  /** Xóa CV theo ID */
  deleteCV: async (cvId) => {
    await apiClient.delete(`${CV_API_URL}/${cvId}`);
  },
};

export default cvService;
