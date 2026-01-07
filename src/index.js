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
    {/* Cung cấp context xác thực cho toàn app */}

      <BrowserRouter>
        {/* <LanguageSwitcher /> */}

        <Switch>
          {/* Khu vực quản trị */}
          <PrivateRoute
            path="/admin"
            component={AdminLayout}
            allowedRoles={["SYSTEM_ADMIN"]}
          />

          {/* Trang đăng nhập / đăng ký */}
          <Route path="/auth" component={AuthLayout} />

          {/* Khu vực sinh viên */}
          <PrivateRoute
            path="/student"
            component={StudentLayout}
            allowedRoles={["STUDENT"]}
          />

          {/* Khu vực nhà tuyển dụng */}
          <PrivateRoute
            path="/employer"
            component={EmployerLayout}
            allowedRoles={["EMPLOYER"]}
          />

          {/* Trang mặc định */}
          <Route path="/" component={MainLayout} />

          {/* Fallback route */}
          <Redirect from="*" to="/" />
        </Switch>

        {/* Toast thông báo toàn cục */}
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>

  </AuthProvider>,
  document.getElementById("root")
);