import React, { useState, useEffect } from "react";
import { useAuth } from "context/AuthContext";
import profileService from "services/profileService";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
import { toast } from "react-toastify";

export default function StudentProfile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const [profileData, cvList] = await Promise.all([
        profileService.getStudentProfile(),
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
      setError(err.response?.data?.message || "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddExperience = async (formData) => {
    try {
      const requestData = {
        companyName: formData.companyName,
        position: formData.role,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate || null
      };

      await profileService.addExperience(requestData);
      await fetchProfile();
      setIsExperienceModalOpen(false);
    } catch (err) {
      alert(t("error_adding_experience", "Lỗi khi thêm kinh nghiệm. Vui lòng thử lại."));
    }
  };

const handleUpdateAbout = (updatedDataFromApi) => {
    
    setProfile((prevProfile) => ({
      ...updatedDataFromApi,
      
      cvName: prevProfile.cvName, 
      cvUrl: prevProfile.cvUrl,
      id: prevProfile.id
    }));

    setIsEditingAbout(false);
    toast.success(t("update_success", "Cập nhật thông tin thành công!"));
  };

  const handleDeleteExperience = async (expId) => {
    if (!window.confirm(t("confirm_delete", "Bạn có chắc muốn xóa?"))) return;
    try {
      await profileService.deleteExperience(expId);
      await fetchProfile();
    } catch (err) {
      alert("Xóa thất bại");
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500 text-lg">{error}</p>
        <button onClick={fetchProfile} className="mt-4 text-brand underline">
          {t("retry", "Thử lại")}
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-blueGray-100 min-h-screen py-10">
      <div className="container mx-auto px-4 flex flex-wrap">
        <div className="w-full px-4 mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blueGray-700">
                {t('my_profile', 'Hồ sơ của tôi')}
            </h2>
            
            {/* Nút Xem trang công khai */}
            {profile && profile.id && (
                <Link
                    to={`/student/view/${profile.userId}`} 
                    target="_blank"
                    className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center"
                >
                    <i className="fas fa-eye mr-2"></i> 
                    {t('view_as_public', 'Xem dưới dạng Công khai')}
                </Link>
            )}
        </div>

        <div className="w-full lg:w-3/12 px-4">
          <ProfileInfoCard profile={profile} />
          <StatsCard />
        </div>

        <div className="w-full lg:w-6/12 px-4">
          <ProfileTabs activeTab={activeTab} onTabClick={setActiveTab} />

          <div className="space-y-6 mt-6">
            {activeTab === "overview" && (
              <>
                <AboutCard
                  profile={profile}
                  isEditing={isEditingAbout}
                  onEditToggle={() => setIsEditingAbout(!isEditingAbout)}
                  onSaveSuccess={handleUpdateAbout}
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

            {activeTab === "skills" && (
              <SkillsCard skills={profile.skills} />
            )}

            {activeTab === "projects" && (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-blueGray-500">
                  {t("projects_coming_soon", "Projects section coming soon...")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-3/12 px-4">
          <ProfileOverviewCard profile={profile} />
          <CVCard
            profile={profile}
            onUploadSuccess={() => fetchProfile()}
          />
          <div className="mt-6">
            <RecentActivityCard profile={profile} />
          </div>
        </div>

      </div>

      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        onSubmit={handleAddExperience}
      />
    </div>
  );
}
