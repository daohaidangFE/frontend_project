import apiClient from "./apiClient";

// Base path khớp với MessageController trong backend
const BASE_URL = "/message/v1";

const messageService = {
  // Lấy danh sách chat của user hiện tại
  getConversations: async () => {
    const response = await apiClient.get(`${BASE_URL}/conversations/my-conversation`);
    return response.data;
  },

  // Tìm hoặc tạo cuộc trò chuyện mới
  findOrCreateConversation: async (targetUserId) => {
    const response = await apiClient.post(`${BASE_URL}/conversations/newConversation`, {
      user2Id: targetUserId 
    });
    return response.data;
  },

  // Lấy lịch sử tin nhắn của 1 conversation
  getMessages: async (conversationId) => {
    const response = await apiClient.get(
      `${BASE_URL}/messages/conversation/${conversationId}`
    );
    return response.data;
  },

  // Gửi tin nhắn Text
  sendTextMessage: async (conversationId, content) => {
    const payload = {
      conversationId,
      content,
      messageType: "TEXT",
    };
    const response = await apiClient.post(`${BASE_URL}/messages`, payload);
    return response.data;
  },

  // Gửi ảnh (Multipart file)
  sendImageMessage: async (file, conversationId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("conversationId", conversationId);
    
    const response = await apiClient.post(`${BASE_URL}/messages/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export default messageService;