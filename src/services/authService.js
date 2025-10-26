import apiClient from "./apiClient";

const AUTH_URL = "/auth";

/**
 * Gửi yêu cầu đăng nhập đến server.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{authResponse: object, user: object}>} - AuthResponse và đối tượng User.
 */

const loginWithApi = async (email, password) => {
  const response = await apiClient.post(`${AUTH_URL}/login`, {
    email: email,
    password: password
  });

  const authResponse = response.data.data;

  const fullToken = `${authResponse.tokenType} ${authResponse.accessToken}`;
  localStorage.setItem('jwt_token', fullToken);
  localStorage.setItem('refresh_token', authResponse.refreshToken);

  const user = {
    userId: authResponse.userId,
    email: email,
    role: authResponse.role,
    fullName: authResponse.fullName,
  };
  localStorage.setItem('user', JSON.stringify(user));
  return {authResponse, user};
};


const registerWithApi = async (userData) => {
  const response = await apiClient.post(`${AUTH_URL}/register`, userData);
  const authResponse = response.data.data;
  const fullToken = `${authResponse.tokenType} ${authResponse.accessToken}`; 
  localStorage.setItem('jwt_token', fullToken); 
  localStorage.setItem('refresh_token', authResponse.refreshToken);

  const user = { 
      userId: authResponse.userId,
      email: userData.email,
      role: authResponse.role, 
      fullName: userData.fullName,
  };
  localStorage.setItem('user', JSON.stringify(user));
  return { authResponse, user };
};

const authService = {
  login: loginWithApi,
  register: registerWithApi,

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },
};


export default authService;