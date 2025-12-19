import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Import components
import MainNavbar from "components/Navbars/MainNavbar.js";
import MainFooter from "components/Footers/MainFooter.js";
// import PrivateRoute from "components/common/PrivateRoute.js";
import HomePage from "views/common/HomePage.js";
// import StudentProfile from "views/student/StudentProfile.js";
import CompanyList from "views/common/CompanyList.js";

export default function MainLayout() {
  return (
    <>
      <MainNavbar />
      <main className="pt-20">
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/companies" exact component={CompanyList} />
          
          <Redirect from="*" to="/" />
        </Switch>
      </main>
      <MainFooter />
    </>
  );
}