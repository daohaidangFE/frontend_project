import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Components
import AdminNavbar from "components/Navbars/AdminNavbar.js"; 
import EmployerSidebar from "components/Sidebar/EmployerSidebar.js";
import MainFooter from "components/Footers/MainFooter.js";
import EmployerDashboard from "views/employer/Dashboard.js";
import CandidateDetail from "views/employer/CandidateDetail.js";
// Views
import CreateJob from "views/employer/CreateJob.js";

export default function EmployerLayout() {
  return (
    <>
      <EmployerSidebar />
      <div className="relative md:ml-64 bg-blueGray-100 min-h-screen">
        <AdminNavbar />
        
        {/* Header Background */}
        <div className="relative bg-brand md:pt-32 pb-32 pt-12"></div>
        
        <div className="px-4 md:px-10 mx-auto w-full -mt-24">
          <Switch>
            <Route path="/employer/create-job" exact component={CreateJob} />
            <Route path="/employer/dashboard" exact component={EmployerDashboard} />
            
            {/* THÊM ROUTE CHAT Ở ĐÂY */}
            {/* <Route path="/employer/messages" exact component={Messages} /> */}
            <Route path="/employer/candidates/:id" exact component={CandidateDetail} />
            
            <Redirect from="/employer" to="/employer/create-job" />
          </Switch>
          <MainFooter />
        </div>
        {/* <FloatingChatButton /> */}
      </div>
    </>
  );
}