import React from "react";
import { Switch, Redirect } from "react-router-dom";

// Components
import HeaderNavbar from "components/Navbars/HeaderNavbar"; 
import MainFooter from "components/Footers/MainFooter.js";
import PrivateRoute from "components/common/PrivateRoute.js";
import ChatWidget from "components/Chat/ChatWidget"; 

// Views
import JobList from "views/student/JobList.js";
import JobDetail from "views/student/JobDetail.js";
import AppliedJobs from "views/student/AppliedJobs.js";
import StudentProfile from "views/student/StudentProfile.js";
import CVManagement from "views/student/CVManagement.js"; 

export default function StudentLayout() {
  return (
    <>
      <HeaderNavbar />
      <main className="pt-20 bg-blueGray-100 min-h-screen">
        <Switch>
          <PrivateRoute 
            path="/student/profile" 
            exact 
            component={StudentProfile} 
            allowedRoles={['STUDENT']} 
          />

          <PrivateRoute 
            path="/student/cv-management" 
            exact 
            component={CVManagement} 
            allowedRoles={['STUDENT']} 
          />

          {/* 2. Trang danh sách việc làm */}
          <PrivateRoute 
            path="/student/jobs" 
            exact 
            component={JobList} 
            allowedRoles={['STUDENT']} 
          />

          {/* 3. Chi tiết việc làm */}
          <PrivateRoute 
            path="/student/jobs/:id" 
            exact 
            component={JobDetail} 
            allowedRoles={['STUDENT']} 
          />

          <PrivateRoute 
            path="/student/my-applications" 
            exact 
            component={AppliedJobs} 
            allowedRoles={['STUDENT']} 
          />
          
          {/* Default Redirect */}
          <Redirect from="/student" to="/student/jobs" />
        </Switch>
      </main>
      <MainFooter />

      <ChatWidget />
    </>
  );
}