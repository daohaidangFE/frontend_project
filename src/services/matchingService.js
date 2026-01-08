import apiClient from "./apiClient";

const MATCHING_ENDPOINT = "/matching/v1"; 

const matchingService = {
  findMyJobs: async (cvId, locationData = {}) => {
    try {
      const payload = {
        cvId: cvId
      };

      const response = await apiClient.post(`${MATCHING_ENDPOINT}/find-my-jobs`, payload);
      return response.data; 
    } catch (error) {
      console.error("Error matching jobs:", error);
      return [];
    }
  },
};

export default matchingService;