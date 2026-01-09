import apiClient from "./apiClient";

const MATCHING_ENDPOINT = "/matching/v1"; 

const matchingService = {
  /**
   * @param {number} cvId
   * @param {object} locationData
   */
  findMyJobs: async (cvId, locationData = {}) => {
    try {
      const payload = {
        cvId: cvId,
        desiredLat: locationData.lat || null,
        desiredLon: locationData.lon || null,
        maxDistanceKm: locationData.maxDistanceKm || 20
      };

      const response = await apiClient.post(`${MATCHING_ENDPOINT}/find-my-jobs`, payload);

      return response.data?.data || response.data || []; 
      
    } catch (error) {
      console.error("Error matching jobs:", error);
      throw error;
    }
  },
};

export default matchingService;