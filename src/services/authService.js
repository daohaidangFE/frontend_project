import apiClient from "./apiClient";

const AUTH_URL = "/auth";

// Login
const loginWithApi = async (email, password) => {
  // Call API
  const response = await apiClient.post(`${AUTH_URL}/login`, {
    email,
    password,
  });

  // Flat data from backend
  const authData = response.data.data;

  // Build user object
  const user = {
    userId: authData.userId,
    email,
    role: authData.role,
    fullName: authData.fullName,
    avatar: authData.avatar || null,
  };

  // Save storage
  localStorage.setItem("accessToken", authData.accessToken);
  localStorage.setItem("refreshToken", authData.refreshToken);
  localStorage.setItem("user", JSON.stringify(user));

  return { user };
};

// Register
const registerWithApi = async (userData) => {
  const response = await apiClient.post(`${AUTH_URL}/register`, userData);
  const authData = response.data.data;

  // Save token
  localStorage.setItem("accessToken", authData.accessToken);
  localStorage.setItem("refreshToken", authData.refreshToken);

  const user = {
    userId: authData.userId,
    email: userData.email,
    role: authData.role,
    fullName: userData.fullName,
  };

  localStorage.setItem("user", JSON.stringify(user));
  return { user };
};

const authService = {
  login: loginWithApi,
  register: registerWithApi,

  // Safe get user
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr || userStr === "undefined") return null;

    try {
      return JSON.parse(userStr);
    } catch (err) {
      console.error("Parse user failed:", err);
      localStorage.removeItem("user");
      return null;
    }
  },

  // Clear auth data
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  },
};

export default authService;
