// src/services/skillService.js
import apiClient from "./apiClient";

const CATEGORY_API_URL = "/skill/v1/categories";
const SKILL_API_URL = "/skill/v1/skills"; 

const unwrap = (response) => response.data?.data || response.data?.result || response.data;

const skillService = {
  // --- PHẦN PUBLIC (AI CŨNG DÙNG ĐƯỢC) ---

  // Tìm kiếm skill (Lưu ý: Backend hiện tại trả về List, chưa có phân trang Page/Size thực sự trong Controller)
  searchSkills: async (keyword) => {
    const params = { q: keyword };
    // Backend search endpoint: /api/skill/v1/skills/search?q=...
    const response = await apiClient.get(`${SKILL_API_URL}/search`, { params });
    return unwrap(response);
  },
  
  getSkillById: async (id) => {
    const response = await apiClient.get(`${SKILL_API_URL}/${id}`);
    return unwrap(response);
  },

  getSkillsBatch: async (ids) => {
    const response = await apiClient.post(`${SKILL_API_URL}/batch`, ids);
    return unwrap(response);
  },

  getAllCategories: async () => {
    const response = await apiClient.get(CATEGORY_API_URL);
    return unwrap(response) || [];
  },

  getCategoryById: async (id) => {
    const response = await apiClient.get(`${CATEGORY_API_URL}/${id}`);
    return unwrap(response);
  },

  getSkillsByCategory: async (categoryId) => {
    // Có 2 đường dẫn trong backend trả về giống nhau, dùng cái nào cũng được
    // 1. /categories/{id}/skills
    // 2. /skills/category/{id}
    const response = await apiClient.get(`${SKILL_API_URL}/category/${categoryId}`);
    return unwrap(response) || [];
  },

  // --- PHẦN ADMIN (CẦN QUYỀN SYSTEM_ADMIN) ---
  // --- [BỔ SUNG] QUẢN LÝ CATEGORY ---

  // Tạo danh mục mới
  createCategory: async (data) => {
    // data: { name, description }
    const response = await apiClient.post(CATEGORY_API_URL, data);
    return unwrap(response);
  },

  // Sửa danh mục
  updateCategory: async (id, data) => {
    // data: { name, description }
    const response = await apiClient.put(`${CATEGORY_API_URL}/${id}`, data);
    return unwrap(response);
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`${CATEGORY_API_URL}/${id}`);
    return unwrap(response);
  },

  // --- [BỔ SUNG] QUẢN LÝ SKILL ---

  // Tạo kỹ năng mới
  createSkill: async (data) => {
    // data: { name, categoryId, description }
    const response = await apiClient.post(SKILL_API_URL, data);
    return unwrap(response);
  },

  // Sửa kỹ năng
  updateSkill: async (id, data) => {
    // data: { name, categoryId, description }
    const response = await apiClient.put(`${SKILL_API_URL}/${id}`, data);
    return unwrap(response);
  },

  // Xóa kỹ năng
  deleteSkill: async (id) => {
    const response = await apiClient.delete(`${SKILL_API_URL}/${id}`);
    return unwrap(response);
  }
};

export default skillService;