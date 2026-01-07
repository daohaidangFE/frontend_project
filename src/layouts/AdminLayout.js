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
import Settings from "views/admin/Settings.js";
import AdminRejectedHiddenJobsTable from "views/admin/AdminRejectedHiddenJobsTable";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>      
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={AdminDashboard} />
            <Route path="/admin/users" exact component={UserTables} />
            <Route path="/admin/job-posts" exact component={JobPostManagement} />
            <Route path="/admin/job-approval" exact component={AdminJobApproval} />
            <Route path="/admin/job-hidden" exact component={AdminRejectedHiddenJobsTable} />
            <Route path="/admin/skills" exact component={SkillManagement} />
            <Route path="/admin/settings" exact component={Settings} />
            <Redirect from="/admin" to="/admin/users" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}