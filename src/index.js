import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./i18n";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts
import AdminLayout from "layouts/AdminLayout.js";
import AuthLayout from "layouts/AuthLayout.js";
import MainLayout from "layouts/MainLayout.js";
import { AuthProvider } from "./context/AuthContext";
import StudentLayout from "layouts/StudentLayout.js";
import EmployerLayout from "layouts/EmployerLayout.js";

// === THÊM DÒNG IMPORT NÀY ===
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher.js";
import PrivateRoute from "components/common/PrivateRoute";

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      {/* === ĐẶT COMPONENT VÀO ĐÂY === */}
      <LanguageSwitcher />
      
      <Switch>
        {/* URL nào bắt đầu bằng /admin sẽ dùng AdminLayout */}
        <Route path="/admin" component={AdminLayout} />

        {/* URL nào bắt đầu bằng /auth sẽ dùng AuthLayout */}
        <Route path="/auth" component={AuthLayout} />

        {/* 2. THÊM ROUTE CHO STUDENT (phải đặt trước MainLayout) */}
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

        {/* Tất cả các URL còn lại sẽ dùng MainLayout */}
        <Route path="/" component={MainLayout} />
      </Switch>
    </BrowserRouter>
  </AuthProvider>,
  document.getElementById("root")
);