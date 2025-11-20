// src/layouts/StudentLayout.js
import React from "react";
import { Switch, Redirect } from "react-router-dom";

// Import components
import StudentNavbar from "components/Navbars/StudentNavbar.js"; // Navbar mới
import MainFooter from "components/Footers/MainFooter.js";
import PrivateRoute from "components/common/PrivateRoute.js";
import JobList from "views/student/JobList.js";

// Import views
import StudentProfile from "views/student/StudentProfile.js";

export default function StudentLayout() {
  return (
    <>
      <StudentNavbar /> {/* Sử dụng Navbar mới */}
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
          <Redirect from="/student" to="/student/jobs" />
        </Switch>
      </main>
      <MainFooter />
    </>
  );
}