// src/views/student/StudentProfile.js
import React, { useState, useEffect } from "react";
import { useAuth } from "context/AuthContext";
import profileService from "services/profileService";
import { useTranslation } from "react-i18next";
import ProfileTabs from "components/Profile/ProfileTabs.js";
import AboutCard from "components/Profile/AboutCard.js";
import EducationCard from "components/Profile/EducationCard.js";
import ExperienceCard from "components/Profile/ExperienceCard.js";
import SkillsCard from "components/Profile/SkillsCard.js";
import CVCard from "components/Profile/CVCard.js";
import ProfileOverviewCard from "components/Profile/ProfileOverviewCard.js";
import StatsCard from "components/Profile/StatsCard.js";
import ProfileInfoCard from "components/Profile/ProfileInfoCard.js";

export default function StudentProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.userId) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await profileService.getStudentProfile(user.userId);
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.message || "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading || error) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center items-center h-64">
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin text-4xl text-brand"></i>
            <p className="ml-3 text-lg">{t("loading", "Loading...")}</p>
          </>
        ) : (
          <p className="text-red-500 text-lg">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-green-100 min-h-screen py-10">
      <div className="container mx-auto px-4 flex flex-wrap">
        {/* --- Cột trái --- */}
        <div className="w-full lg:w-3/12 px-4">
            <ProfileInfoCard profile={profile} />

            <StatsCard />
        </div>

        {/* --- Cột giữa --- */}
        <div className="w-full lg:w-6/12 px-4">
          <ProfileTabs activeTab={activeTab} onTabClick={setActiveTab} />
          <div className="space-y-6 mt-6">
            {activeTab === "overview" && (
              <>
                <AboutCard profile={profile} />
                <EducationCard educations={profile.educations} />
                <ExperienceCard experiences={profile.experiences} />
                <SkillsCard skills={profile.skills} />
              </>
            )}
            {activeTab === "education" && (
              <EducationCard educations={profile.educations} />
            )}
            {activeTab === "experience" && (
              <ExperienceCard experiences={profile.experiences} />
            )}
            {activeTab === "skills" && <SkillsCard skills={profile.skills} />}
            {activeTab === "projects" && (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                {t("projects_coming_soon", "Projects section coming soon...")}
              </div>
            )}
          </div>
        </div>

        {/* --- Cột phải --- */}
        <div className="w-full lg:w-3/12 px-4">
          <ProfileOverviewCard profile={profile} />
          <CVCard profile={profile} />
        </div>
      </div>
    </div>
  );
}
