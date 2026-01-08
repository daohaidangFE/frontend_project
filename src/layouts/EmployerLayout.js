import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect, useHistory, useLocation } from "react-router-dom";
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
import EmployerOnboarding from "views/employer/EmployerOnboarding.js";
import EmployerProfile from "views/employer/EmployerProfile.js";

import profileService from "services/profileService";

export default function EmployerLayout() {
  const history = useHistory();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkCompanyStatus = async () => {
      try {
        const data = await profileService.getMyEmployerProfile();
        const hasCompany = data && data.company && data.company.id;
        const isOnboardingPage = location.pathname === "/employer/onboarding";

        if (!hasCompany) {
          if (!isOnboardingPage) {
            history.push("/employer/onboarding");
          }
        } else {
          if (isOnboardingPage) {
            history.push("/employer/dashboard");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setChecking(false);
      }
    };

    checkCompanyStatus();
  }, [history, location.pathname]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-blueGray-100">
        <i className="fas fa-circle-notch fa-spin text-4xl text-blueGray-400"></i>
      </div>
    );
  }

  return (
    <>
      <EmployerSidebar />
      <div className="relative md:ml-64 bg-blueGray-100 min-h-screen">
        <AdminNavbar />
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>

        <div className="px-4 md:px-10 mx-auto w-full -mt-24">
          <Switch>
            <Route path="/employer/onboarding" exact component={EmployerOnboarding} />
            <Route path="/employer/profile" exact component={EmployerProfile} />
            <Route path="/employer/create-job" exact component={CreateJob} />
            <Route path="/employer/dashboard" exact component={EmployerDashboard} />
            <Route path="/employer/my-jobs" exact component={MyJobs} />
            <Route
              path="/employer/posts/:postId/applications"
              exact
              component={PostApplications}
            />
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
