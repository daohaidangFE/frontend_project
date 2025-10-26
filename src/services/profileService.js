import apiClient from './apiClient';

const PROFILE_URL = "/profile/v1/student-profile";


const ProfileService = {

    getStudentProfile: async (userId) => {
        const response = await apiClient.get(`${PROFILE_URL}/me`, {
            params: { userId: userId }
        });
        return response.data.data; 
    },

    updateBasicProfile: async (profileData) => {
        const response = await apiClient.put(`${PROFILE_URL}/me`, profileData);
        return response.data.data;
    },

    replaceEducations: async (userId, educations) => {
        await apiClient.put(`${PROFILE_URL}/me/educations`, educations, {
            params: { userId: userId }
        });
    },
    replaceExperiences: async (userId, experiences) => {
        await apiClient.put(`${PROFILE_URL}/me/experiences`, experiences, {
            params: { userId: userId }
        });
    },
};

export default ProfileService;
