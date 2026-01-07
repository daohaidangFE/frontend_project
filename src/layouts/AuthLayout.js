// src/layouts/AuthLayout.js
import React from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// views
import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";
import ForgotPassword from "views/auth/ForgotPassword.js"
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher.js";

export default function AuthLayout() {
  const { t } = useTranslation();
  return (
    <main className="flex justify-center items-stretch min-h-screen bg-slate-50">
      <div className="absolute top-5 left-5 z-50 flex items-center gap-2">
        
        <Link to="/" className="bg-white text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase px-3 py-2 rounded-full shadow hover:shadow-md transition-all">
           <i className="fas fa-arrow-left mr-2"></i> {t('home_button')}
        </Link>
        <LanguageSwitcher />
      </div>
      <div className="w-full mx-0 flex bg-white shadow-lg overflow-hidden">

        {/* Cột chứa form */}
        <div className="w-full lg:w-7/12 p-8 lg:px-12 lg:pt-36 lg:pb-16 flex flex-col justify-between min-h-screen">
          <Switch>
            <Route path="/auth/login" exact component={Login} />
            <Route path="/auth/register" exact component={Register} />
            <Route path="/auth/forgotpassword" exact component={ForgotPassword} />
            <Redirect from="/auth" to="/auth/login" />
          </Switch>
        </div>

        {/* Cột chứa ảnh */}
        <div className="hidden lg:flex lg:w-5/12 justify-center items-center h-full">
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