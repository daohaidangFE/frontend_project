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
import RecentActivityCard from "components/Profile/RecentActivityCard";
import ExperienceModal from "components/Modals/ExperienceModal";
import cvService from "services/cvService";

export default function StudentProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.userId) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const [profileData, cvList] = await Promise.all([
            profileService.getStudentProfile(user.userId),
            cvService.getMyCVs().catch(err => [])
        ]);

        if (cvList && cvList.length > 0) {
            cvList.sort((a, b) => b.id - a.id);

            const latestCV = cvList[0]; 

            if (latestCV) {
                profileData.cvUrl = latestCV.cvUrl;
                profileData.cvName = latestCV.cvName;
            }
        }
        setProfile(profileData);
        setError(null);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.response?.data?.message || "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleExperienceSubmit = async (newExperienceData) => {
    if (!user?.userId) return;

    const formattedNewData = {
      ...newExperienceData,
      endDate: newExperienceData.endDate || null,
    };
    const newList = [...profile.experiences, formattedNewData];

    try {
      await profileService.replaceExperiences(user.userId, newList);
      const updatedProfile = await profileService.getStudentProfile(user.userId);
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Failed to add experience:", err);
    }
  };

  if (loading) {
      return (
        <div className="container mx-auto px-4 py-10 flex justify-center items-center h-64">
          <i className="fas fa-spinner fa-spin text-4xl text-brand"></i>
          <p className="ml-3 text-lg">{t("loading", "Loading...")}</p>
        </div>
      );
    }

  // 2. Kiểm tra LỖI
  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center items-center h-64">
        <i className="fas fa-spinner fa-spin text-4xl text-brand"></i>
        <p className="ml-3 text-lg">{t("loading", "Loading...")}</p>
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
                <AboutCard 
                  profile={profile}
                  isEditing={isEditingAbout}
                  onEditToggle={() => setIsEditingAbout(!isEditingAbout)}
                  onSaveSuccess={(updateProfile) => {
                    setProfile(updateProfile);
                    setIsEditingAbout(false);
                  }}
                />
                <EducationCard educations={profile.educations} />
                <ExperienceCard 
                  experiences={profile.experiences}
                  onAddClick={() => setIsExperienceModalOpen(true)}
                />
                <SkillsCard skills={profile.skills} />
              </>
            )}
            {activeTab === "education" && (
              <EducationCard educations={profile.educations} />
            )}
            {activeTab === "experience" && (
              <ExperienceCard 
                experiences={profile.experiences}
                onAddClick={() => setIsExperienceModalOpen(true)}
              />
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
          <CVCard 
            profile={profile}
            onUploadSuccess={() => {
              window.location.reload();
            }}
          />
        </div>
      </div>
      <div className="container mx-auto px-4 my-4" >
          <RecentActivityCard profile={profile} />
      </div>
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        onSubmit={handleExperienceSubmit} 
      />
    </div>
  );
}
