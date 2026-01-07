import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// Import các trang view của Admin
import JobPostManagement from "views/admin/JobPostManagement.js";
import AdminJobApproval from "views/admin/AdminJobApproval.js";
import UserTables from "views/admin/UserTables.js"; 
// [MỚI] Import trang SkillManagement
import SkillManagement from "views/admin/SkillManagement.js"; 

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12"></div>
        
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            {/* 1. Route Quản lý người dùng */}
            <Route path="/admin/users" exact component={UserTables} />

            {/* 2. Route quản lý bài đăng chung (Tất cả bài) */}
            <Route path="/admin/job-posts" exact component={JobPostManagement} />
            
            {/* 3. Route phê duyệt bài đăng (Chỉ bài PENDING) */}
            <Route path="/admin/job-approval" exact component={AdminJobApproval} />

            {/* 4. [MỚI] Route Quản lý Kỹ năng */}
            <Route path="/admin/skills" exact component={SkillManagement} />
            
            {/* 5. Điều hướng mặc định */}
            <Redirect from="/admin" to="/admin/users" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}