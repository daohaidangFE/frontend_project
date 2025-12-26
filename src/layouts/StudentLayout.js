import React from "react";
import { Switch, Redirect, Route } from "react-router-dom"; // THÊM Route vào đây
// Import components
import StudentNavbar from "components/Navbars/StudentNavbar.js"; 
import MainFooter from "components/Footers/MainFooter.js";
import PrivateRoute from "components/common/PrivateRoute.js";
import JobList from "views/student/JobList.js";
import JobDetail from "views/student/JobDetail.js";
import AppliedJobs from "views/student/AppliedJobs.js";

// Import views
import StudentProfile from "views/student/StudentProfile.js";
import PublicStudentProfile from "views/student/PublicStudentProfile.js";

export default function StudentLayout() {
  return (
    <>
      <StudentNavbar />
      <main className="pt-20">
        <Switch>
          <PrivateRoute 
            path="/student/profile" 
            exact 
            component={StudentProfile} 
            allowedRoles={['STUDENT']} 
          />
          <PrivateRoute 
            path="/student/jobs" 
            exact 
            component={JobList} 
            allowedRoles={['STUDENT']} 
          />
          <PrivateRoute 
            path="/student/jobs/:id" 
            exact 
            component={JobDetail} 
            allowedRoles={['STUDENT']} 
          />
          <PrivateRoute 
            path="/student/view/:id" 
            exact 
            component={PublicStudentProfile} 
            allowedRoles={['STUDENT']} 
          />
          <PrivateRoute 
            path="/student/applied-jobs" 
            exact 
            component={AppliedJobs} 
            allowedRoles={['STUDENT']} 
          />
          
          {/* THÊM ROUTE CHAT Ở ĐÂY */}
          {/* <PrivateRoute 
            path="/student/messages" 
            exact 
            component={Messages} 
            allowedRoles={['STUDENT']} 
          /> */}
          <Redirect from="/student" to="/student/jobs" />
        </Switch>
      </main>
      <MainFooter />
      {/* <FloatingChatButton /> */}
    </>
  );
}