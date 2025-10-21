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
      <div className="w-full max-w-6xl mx-auto flex bg-white shadow-lg rounded-xl overflow-hidden">

        {/* Cột chứa form */}
        <div className="w-full lg:w-7/12 p-8 lg:px-12 lg:pt-36 lg:pb-16 flex flex-col justify-start">
          <Switch>
            <Route path="/auth/login" exact component={Login} />
            <Route path="/auth/register" exact component={Register} />
            <Route path="/auth/forgotpassword" exact component={ForgotPassword} />
            <Redirect from="/auth" to="/auth/login" />
          </Switch>
        </div>

        {/* Cột chứa ảnh */}
        <div className="hidden lg:flex lg:w-5/12 justify-center items-center">
          <img
            src="/anh1.png"
            alt="Illustration"
            className="w-full h-full object-cover object-left"
          />
        </div>
      </div>
    </main>
  );
}