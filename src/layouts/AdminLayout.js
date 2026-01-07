import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// Import các trang view của Admin
import JobPostManagement from "views/admin/JobPostManagement.js";
import AdminJobApproval from "views/admin/AdminJobApproval.js";
import UserTables from "views/admin/UserTables.js"; 
import AdminDashboard from "views/admin/AdminDashboard";
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
            <Route path="/admin/dashboard" exact component={AdminDashboard} />
            <Route path="/admin/users" exact component={UserTables} />
            <Route path="/admin/job-posts" exact component={JobPostManagement} />
            <Route path="/admin/job-approval" exact component={AdminJobApproval} />
            <Route path="/admin/skills" exact component={SkillManagement} />
            <Redirect from="/admin" to="/admin/users" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}