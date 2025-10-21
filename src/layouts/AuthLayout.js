// src/layouts/AuthLayout.js
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// views
import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";
import ForgotPassword from "views/auth/ForgotPassword.js"

export default function AuthLayout() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-slate-50">
      
      {/* Container chính, bạn có thể giảm max-w-6xl thành max-w-5xl nếu muốn nó hẹp hơn */}
      <div className="w-full max-w-6xl mx-auto flex bg-white shadow-lg rounded-xl overflow-hidden">

        {/* Cột 1: Form (Login hoặc Register) */}
        {/* === THAY ĐỔI Ở ĐÂY: Tăng chiều rộng từ 1/2 lên 7/12 === */}
        <div className="w-full lg:w-7/12 p-8 lg:p-12 flex flex-col justify-center">
          <Switch>
            <Route path="/auth/login" exact component={Login} />
            <Route path="/auth/register" exact component={Register} />
            <Route path="/auth/forgotpassword" exact component={ForgotPassword} />
            <Redirect from="/auth" to="/auth/login" />
          </Switch>
        </div>

        {/* Cột 2: Hình ảnh */}
        {/* === THAY ĐỔI Ở ĐÂY: Giảm chiều rộng từ 1/2 xuống 5/12 === */}
        <div className="hidden lg:flex lg:w-5/12 justify-center items-center">
          <img
            src="/anh1.png"
            alt="Illustration"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </main>
  );
}