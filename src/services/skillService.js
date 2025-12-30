// src/services/skillService.js
import apiClient from "./apiClient";

const CATEGORY_API_URL = "/skill/v1/categories";
const SKILL_API_URL = "/skill/v1/skills"; 

const unwrap = (response) => response.data?.data || response.data?.result || response.data;

const skillService = {
  searchSkills: async (keyword, page = 0, size = 10) => {
    const params = { 
        q: keyword, 
        page, 
        size 
    };
    
    const url = keyword ? `${SKILL_API_URL}/search` : SKILL_API_URL;
    
    const response = await apiClient.get(url, { params });
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

  getSkillsByCategory: async (categoryId) => {
    const response = await apiClient.get(`${SKILL_API_URL}/category/${categoryId}`);
    return unwrap(response) || [];
  }
};

export default skillService;