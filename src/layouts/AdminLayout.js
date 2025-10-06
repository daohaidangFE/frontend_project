import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// Import trang view
import JobPostManagement from "views/admin/JobPostManagement.js";

export default function Admin() { // Tên function có thể vẫn là Admin, không sao cả
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <div className="px-4 md:px-10 mx-auto w-full h-full pt-24 pb-12">
          <Switch>
            <Route path="/admin/job-posts" exact component={JobPostManagement} />
            <Redirect from="/admin" to="/admin/job-posts" />
          </Switch>
        </div>
        <FooterAdmin />
      </div>
    </>
  );
}