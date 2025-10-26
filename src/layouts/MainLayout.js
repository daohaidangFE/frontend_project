import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Import components
import MainNavbar from "components/Navbars/MainNavbar.js";
import MainFooter from "components/Footers/MainFooter.js";
import MyProfile from "views/student/MyProfile";
import PrivateRoute from "components/common/PrivateRoute.js";
// Import views
import HomePage from "views/common/HomePage.js"; // <-- THÊM DÒNG NÀY

export default function MainLayout() {
  return (
    <>
      <MainNavbar />
      <main className="pt-20">
        <Switch>
          <Route path="/" exact component={HomePage} />
          <PrivateRoute 
             path="/student/profile" 
             exact 
             component={MyProfile} 
             allowedRoles={["STUDENT"]} 
          />
          
          <Redirect from="*" to="/" />
        </Switch>
      </main>
      <MainFooter />
    </>
  );
}