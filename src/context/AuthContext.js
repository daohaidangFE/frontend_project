import React, { createContext, useState, useContext } from "react";

// 1. Tạo Context object
const AuthContext = createContext(null);

// 2. Tạo component Provider (Người cung cấp)
// Component này sẽ "bọc" toàn bộ ứng dụng của chúng ta
export const AuthProvider = ({ children }) => {
  // Dùng useState để lưu thông tin người dùng. Ban đầu là null (chưa đăng nhập)
  const [user, setUser] = useState(null);

  // Hàm để xử lý logic đăng nhập
  const login = (userData) => {
    // Cập nhật state với thông tin người dùng
    setUser(userData);
  };

  // Hàm để xử lý logic đăng xuất
  const logout = () => {
    setUser(null);
    // Sau này sẽ thêm cả việc xóa token khỏi localStorage ở đây
    localStorage.removeItem('jwt_token');
  };

  // 3. Đóng gói những thứ cần cung cấp (state và các hàm)
  const value = {
    user, // Thông tin người dùng hiện tại (hoặc null)
    isLoggedIn: !!user, // Một biến boolean tiện lợi: true nếu user khác null
    login,
    logout,
  };

  // 4. "Phát sóng" value này cho tất cả các component con bên trong nó
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Tạo một custom hook để sử dụng Context dễ dàng hơn
// Thay vì phải import useContext và AuthContext ở nhiều nơi,
// chúng ta chỉ cần gọi useAuth() là xong.
export const useAuth = () => {
  return useContext(AuthContext);
};