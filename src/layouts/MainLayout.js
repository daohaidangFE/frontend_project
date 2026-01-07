import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { useAuth } from "context/AuthContext";

import MainFooter from "components/Footers/MainFooter.js";
import HomePage from "views/common/HomePage.js";
import CompanyList from "views/common/CompanyList.js";
import HeaderNavbar from "components/Navbars/HeaderNavbar"; 
import PublicStudentProfile from "views/student/PublicStudentProfile.js";

export default function MainLayout() {
  
  return (
    <>
      {/* <MainNavbar /> */}
      <HeaderNavbar />
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