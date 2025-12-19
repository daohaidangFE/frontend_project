import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import profileService from "services/profileService";
import { toast } from "react-toastify";

import ProfileOverviewCard from "components/Profile/ProfileOverviewCard";
import AboutCard from "components/Profile/AboutCard";
import CVCard from "components/Profile/CVCard";
// import EducationCard from "components/Profile/EducationCard";
// import ExperienceCard from "components/Profile/ExperienceCard";
// import SkillsCard from "components/Profile/SkillsCard";

export default function PublicStudentProfile() {
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await profileService.getStudentById(id);

        if (data.cvUrl) {
            data.cvName = "Xem CV chi tiết"; 
        }

        setProfile(data);
      } catch (err) {
        console.error(err);
        const errorCode = err.response?.data?.code;
        
        if (errorCode === "STU_008") {
             setError(t('profile_private_error', "Hồ sơ này đang ở chế độ riêng tư."));
        } else {
             setError(t('profile_fetch_error', "Không thể tải thông tin hồ sơ."));
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProfile();
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-24 bg-blueGray-100">
        <i className="fas fa-spinner fa-spin text-4xl text-brand"></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-blueGray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl mx-auto mt-10">
           <div className="text-red-500 text-6xl mb-4">
              <i className="fas fa-lock"></i>
           </div>
           <h2 className="text-2xl font-bold text-blueGray-700 mb-2">{t('access_denied', "Truy cập bị từ chối")}</h2>
           <p className="text-blueGray-500 mb-6">{error}</p>
           <button 
             onClick={() => history.goBack()}
             className="bg-brand text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
           >
             {t('go_back', "Quay lại")}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-blueGray-100 min-h-screen pt-24 pb-20">
      <div className="absolute top-0 w-full h-80 bg-brand rounded-b-3xl transform -skew-y-2 origin-top-left -mt-20 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-4/12 px-4">
            <div className="sticky top-24">
                <ProfileOverviewCard profile={profile} />
                
                <div className="mt-6">
                    <CVCard 
                        profile={profile} 
                        readOnly={true}
                    />
                </div>

                <div className="mt-6 bg-white p-6 rounded-lg shadow-lg text-center">
                    <h6 className="text-blueGray-700 text-lg font-bold mb-2">{t('contact_student', "Liên hệ sinh viên")}</h6>
                    <button 
                        className="w-full bg-emerald-500 text-white font-bold uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 transition-all"
                        onClick={() => toast.info(t('feature_coming_soon', "Tính năng Chat sắp ra mắt!"))}
                    >
                        <i className="fas fa-comment-dots mr-2"></i> {t('send_message', "Gửi tin nhắn")}
                    </button>
                </div>
            </div>
          </div>

          <div className="w-full lg:w-8/12 px-4 mt-6 lg:mt-0">
             <div className="flex flex-col gap-6">
                <AboutCard 
                    profile={profile} 
                    isEditing={false} 
                    onEditToggle={() => {}} 
                    readOnly={true}
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}