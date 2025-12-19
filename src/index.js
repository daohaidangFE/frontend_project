import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./i18n";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";
import AdminLayout from "layouts/AdminLayout.js";
import AuthLayout from "layouts/AuthLayout.js";
import MainLayout from "layouts/MainLayout.js";
import { AuthProvider } from "./context/AuthContext";
import StudentLayout from "layouts/StudentLayout.js";
import EmployerLayout from "layouts/EmployerLayout.js";
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher.js";
import PrivateRoute from "components/common/PrivateRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      <LanguageSwitcher />
      
      <Switch>
        {/* 1. SỬA: Bảo vệ Route Admin bằng PrivateRoute */}
        <PrivateRoute 
          path="/admin" 
          component={AdminLayout} 
          allowedRoles={['SYSTEM_ADMIN']}
        />

        <Route path="/auth" component={AuthLayout} />

        <PrivateRoute 
          path="/student" 
          component={StudentLayout}
          allowedRoles={['STUDENT']}
        />

        <PrivateRoute 
          path="/employer" 
          component={EmployerLayout} 
          allowedRoles={['EMPLOYER']} 
        />

        {/* Trang chủ nên để cuối cùng */}
        <Route path="/" component={MainLayout} />
        
        {/* 2. THÊM: Redirect nếu gõ link sai */}
        <Redirect from="*" to="/" />
      </Switch>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </AuthProvider>,
  document.getElementById("root")
);