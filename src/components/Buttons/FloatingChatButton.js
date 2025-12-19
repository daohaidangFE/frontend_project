import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";

export default function FloatingChatButton() {
  const { user, isLoggedIn } = useAuth();
  const history = useHistory();

  const handleClick = () => {
    if (!isLoggedIn || !user) {
      history.push("/auth/login");
      return;
    }

    const role = user.role ? user.role.toUpperCase() : "";
    
    if (role === "STUDENT") {
      history.push("/student/messages");
    } else if (role === "EMPLOYER") {
      history.push("/employer/messages");
    } else if (role.includes("ADMIN")) {
      history.push("/admin/messages");
    } else {
      history.push("/");
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-brand rounded-full shadow-lg hover:bg-emerald-600 hover:scale-110 transition-all duration-300 cursor-pointer group border-2 border-white"
      title={isLoggedIn ? "Chat ngay" : "Đăng nhập để chat"}
    >
      <i className="fas fa-comment-dots text-white text-2xl"></i>
      
      {isLoggedIn && (
        <span className="absolute top-0 right-0 flex h-4 w-4 -mt-1 -mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
        </span>
      )}
    </div>
  );
}
