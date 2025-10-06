import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Import components
import MainNavbar from "components/Navbars/MainNavbar.js";
import MainFooter from "components/Footers/MainFooter.js";

// Import views
import HomePage from "views/common/HomePage.js"; // <-- THÊM DÒNG NÀY

export default function MainLayout() {
  return (
    <>
      <MainNavbar />
      <main className="pt-20">
        <Switch>
          {/* SỬA LẠI ĐỂ DÙNG COMPONENT HOMEPAGE */}
          <Route path="/" exact component={HomePage} />
          
          {/* Các trang khác sẽ được thêm vào đây, ví dụ: */}
          {/* <Route path="/jobs" exact component={JobSearchPage} /> */}
          {/* <Route path="/companies" exact component={CompanyListPage} /> */}
          
          <Redirect from="*" to="/" />
        </Switch>
      </main>
      <MainFooter />
    </>
  );
}