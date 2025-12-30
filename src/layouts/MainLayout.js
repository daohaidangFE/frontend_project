import React, { useEffect } from "react"; // 1. Thêm useEffect
import { Switch, Route, Redirect } from "react-router-dom";

// Import hooks
import { useAuth } from "context/AuthContext"; // 2. Import useAuth

// Import components
import MainNavbar from "components/Navbars/MainNavbar.js";
import MainFooter from "components/Footers/MainFooter.js";
import HomePage from "views/common/HomePage.js";
import CompanyList from "views/common/CompanyList.js";

import PublicStudentProfile from "views/student/PublicStudentProfile.js";

export default function MainLayout() {
  
  return (
    <>
      <MainNavbar />
      <main className="pt-20">
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/companies" exact component={CompanyList} />
          <Route 
            path="/p/:id" 
            exact 
            component={PublicStudentProfile}  
          />
          <Redirect from="*" to="/" />
        </Switch>
      </main>
      <MainFooter />
    </>
  );
}