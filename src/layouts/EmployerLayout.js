import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import ChatWidget from "components/Chat/ChatWidget";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import EmployerSidebar from "components/Sidebar/EmployerSidebar.js";
import MainFooter from "components/Footers/MainFooter.js";
import EmployerDashboard from "views/employer/Dashboard.js";
import CandidateDetail from "views/employer/CandidateDetail.js";
import PostApplications from "views/employer/PostApplications.js";
import JobDetail from "views/employer/JobDetail.js";
import CreateJob from "views/employer/CreateJob.js";
import MyJobs from "views/employer/MyJobs.js";
import JobEdit from "views/employer/JobEdit";
export default function EmployerLayout() {
  return (
    <>
      <EmployerSidebar />
      
      <div className="relative md:ml-64 bg-blueGray-100 min-h-screen">
        <AdminNavbar />
        
        <div className="relative bg-lightBlue-600 pb-32 pt-12"></div>
        
        <div className="px-4 md:px-10 mx-auto w-full -mt-24">
          <Switch>
            <Route path="/employer/create-job" exact component={CreateJob} />
            <Route path="/employer/dashboard" exact component={EmployerDashboard} />
            
            <Route path="/employer/my-jobs" exact component={MyJobs} />
            
            <Route path="/employer/posts/:postId/applications" exact component={PostApplications} />
            <Route path="/employer/candidates/:id" exact component={CandidateDetail} />  
            <Route path="/employer/jobs/:id/edit" exact component={JobEdit} />
            <Route path="/employer/jobs/:id" exact component={JobDetail} />  
            <Redirect from="/employer" to="/employer/dashboard" />
          </Switch>
          <MainFooter />
        </div>
      </div>
      <ChatWidget />
    </>
  );
}