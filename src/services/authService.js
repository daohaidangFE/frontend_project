import apiClient from "./apiClient"; 

const AUTH_URL = "/auth";

// Login
const loginWithApi = async (email, password) => {
  const response = await apiClient.post(`${AUTH_URL}/login`, {
    email,
    password,
  });

  const authData = response.data.data;

  const user = {
    userId: authData.userId,
    email,
    role: authData.role,
    fullName: authData.fullName,
    avatar: authData.avatar || null,
  };

  localStorage.setItem("accessToken", authData.accessToken);
  localStorage.setItem("refreshToken", authData.refreshToken);
  localStorage.setItem("user", JSON.stringify(user));

  return { user };
};

// Register
const registerWithApi = async (userData) => {
  const response = await apiClient.post(`${AUTH_URL}/register`, userData);
  const authData = response.data.data;

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

const logoutWithApi = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await apiClient.post(`${AUTH_URL}/logout`, { refreshToken });
    }
  } catch (err) {
    console.error("Logout API error:", err);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  }
};

// --- Change Password ---
const changePassword = async (data) => {
    return await apiClient.post(`${AUTH_URL}/change-password`, data);
};

const authService = {
  login: loginWithApi,
  register: registerWithApi,
  logout: logoutWithApi,
  changePassword: changePassword,

  // Safe get user
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr || userStr === "undefined") return null;
    try {
      return JSON.parse(userStr);
    } catch (err) {
      localStorage.removeItem("user");
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },

  hasRole: (role) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return user.role === role;
    } catch (e) {
      return false;
    }
  }
};

export default authService;