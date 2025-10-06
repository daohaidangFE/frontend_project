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

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* URL nào bắt đầu bằng /admin sẽ dùng AdminLayout */}
      <Route path="/admin" component={AdminLayout} />

      {/* URL nào bắt đầu bằng /auth sẽ dùng AuthLayout */}
      <Route path="/auth" component={AuthLayout} />

      {/* Tất cả các URL còn lại sẽ dùng MainLayout */}
      <Route path="/" component={MainLayout} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);