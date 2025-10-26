import React, {createContext, useState, useContext} from "react";
import authService from "services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(authService.getCurrentUser());

  const login = (userObject) => {
    setUser(userObject);
  };
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};