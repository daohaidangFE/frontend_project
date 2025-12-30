import apiClient from "./apiClient";

const PROFILE_V2_URL = "/profile/v2/students/me";
const COMPANY_URL = "/profile/v1/companies";

const unwrap = (response) => response.data?.data || response.data?.result || response.data;

const profileService = {

    getStudentProfile: async () => {
        const response = await apiClient.get(PROFILE_V2_URL);
        return unwrap(response);
    },

    getStudentById: async (userId) => {
        const response = await apiClient.get(`/profile/v2/students/${userId}`);
        return unwrap(response);
    },

    updateBasicProfile: async (profileData) => {
        const response = await apiClient.put(PROFILE_V2_URL, profileData);
        return unwrap(response);
    },

    updateVisibility: async (isPublic) => {
        const response = await apiClient.patch(`${PROFILE_V2_URL}/visibility`, null, {
            params: { public: isPublic }
        });
        return unwrap(response);
    },

    // --- EDUCATION ---
    getAllEducations: async () => {
        const response = await apiClient.get(`${PROFILE_V2_URL}/educations`);
        return unwrap(response) || [];
    },

    addEducation: async (educationData) => {
        const response = await apiClient.post(`${PROFILE_V2_URL}/educations`, educationData);
        return unwrap(response);
    },

    updateEducation: async (id, educationData) => {
        const response = await apiClient.put(`${PROFILE_V2_URL}/educations/${id}`, educationData);
        return unwrap(response);
    },

    deleteEducation: async (id) => {
        await apiClient.delete(`${PROFILE_V2_URL}/educations/${id}`);
    },

    // --- EXPERIENCE ---
    getAllExperiences: async () => {
        const response = await apiClient.get(`${PROFILE_V2_URL}/experiences`);
        return unwrap(response) || [];
    },

    addExperience: async (experienceData) => {
        const response = await apiClient.post(`${PROFILE_V2_URL}/experiences`, experienceData);
        return unwrap(response);
    },

    updateExperience: async (id, experienceData) => {
        const response = await apiClient.put(`${PROFILE_V2_URL}/experiences/${id}`, experienceData);
        return unwrap(response);
    },

    deleteExperience: async (id) => {
        await apiClient.delete(`${PROFILE_V2_URL}/experiences/${id}`);
    },

    // --- COMPANY ---
    getAllCompanies: async () => {
        const response = await apiClient.get(`${COMPANY_URL}/all`);
        return unwrap(response) || [];
    },

    getCompanyById: async (id) => {
        try {
            const response = await apiClient.get(`${COMPANY_URL}/all`);
            const allCompanies = unwrap(response) || [];
            return allCompanies.find(comp => String(comp.id) === String(id)) || null;
        } catch (error) {
            console.error("Lỗi khi tìm công ty theo ID:", error);
            return null;
        }
    },
    getAllSkills: async () => {
        const response = await apiClient.get(`${PROFILE_V2_URL}/skills`);
        return unwrap(response) || [];
    },
    addSkill: async (data) => {
        const response = await apiClient.post(`${PROFILE_V2_URL}/skills`, data);
        return unwrap(response);
    },
    deleteSkill: async (id) => {
        await apiClient.delete(`${PROFILE_V2_URL}/skills/${id}`);
    }
};

export default profileService;