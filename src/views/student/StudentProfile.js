import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// UI Components
import AboutCard from "components/Profile/AboutCard";
import CVCard from "components/Profile/CVCard";
import SkillsCard from "components/Profile/SkillsCard";
import ExperienceCard from "components/Profile/ExperienceCard";
import EducationCard from "components/Profile/EducationCard";

// Modals
import EducationModal from "components/Modals/EducationModal";
import ExperienceModal from "components/Modals/ExperienceModal";
import SkillModal from "components/Modals/SkillModal";
import AboutModal from "components/Modals/AboutModal";

// Services
import profileService from "services/profileService";
import authService from "services/authService";
import cvService from "services/cvService";

export default function Profile() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // State Modal
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // --- 1. LOAD DATA ---
  const fetchProfile = async () => {
    try {
      const [studentData, educations, experiences, skills, cvList] = await Promise.all([
        profileService.getStudentProfile(),
        profileService.getAllEducations().catch(() => []),
        profileService.getAllExperiences().catch(() => []),
        profileService.getAllSkills().catch(() => []),
        cvService.getMyCVs().catch(() => [])
      ]);

      if (cvList && cvList.length > 0) {
        cvList.sort((a, b) => b.id - a.id);
      }
      const displayCv = cvList[0]; 
      const cvUrl = displayCv ? displayCv.cvUrl : null;

      setProfile({
        ...studentData,
        educations,
        experiences,
        skills,
        cvUrl: cvUrl
      });
    } catch (error) {
      console.error(error);
      toast.error(t("profile.load_error", "Lỗi tải hồ sơ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // --- 2. MODAL & HANDLERS ---
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
  };
  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
  };

  // ... (Giữ nguyên các hàm handleAboutSubmit, handleEducationSubmit, handleExperienceSubmit, handleSkillSubmit, handleDelete như cũ)
  // Để gọn code mình ẩn bớt phần logic submit/delete vì không thay đổi
  const handleAboutSubmit = async (formData) => { /* ...code cũ... */ 
      await profileService.updateBasicProfile(formData);
      closeModal(); fetchProfile();
  };
  const handleEducationSubmit = async (formData) => { /* ...code cũ... */ 
      if(editingItem) await profileService.updateEducation(editingItem.id, formData);
      else await profileService.addEducation(formData);
      closeModal(); fetchProfile();
  };
  const handleExperienceSubmit = async (formData) => { /* ...code cũ... */ 
      if(editingItem) await profileService.updateExperience(editingItem.id, formData);
      else await profileService.addExperience(formData);
      closeModal(); fetchProfile();
  };
  const handleSkillSubmit = async (formData) => { /* ...code cũ... */ 
      await profileService.addSkill(formData);
      closeModal(); fetchProfile();
  };
  const handleDelete = async (type, id) => { /* ...code cũ... */ 
      if (type === 'education') await profileService.deleteEducation(id);
      if (type === 'experience') await profileService.deleteExperience(id);
      if (type === 'skill') await profileService.deleteSkill(id);
      fetchProfile();
  };


  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!profile) return <div className="p-10 text-center">Profile not found</div>;

  return (
    <>
      {/* Header & Background */}
      <div className="relative pt-14 pb-32 flex content-center items-center justify-center min-h-screen-75">
        <div className="absolute top-0 w-full h-full bg-center bg-cover" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&auto=format&fit=crop&w=2710&q=80')" }}>
          <span className="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
        <div className="container relative mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <h1 className="text-white font-semibold text-5xl">{profile.fullName}</h1>
              <p className="mt-4 text-lg text-gray-300">{profile.headline || "Sinh viên"}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6 relative">
              
              <div className="absolute top-4 right-4 z-50">
                <Link
                  to={`/p/${profile.userId}`}
                  target="_blank"
                  className="bg-white border border-blueGray-200 text-blueGray-600 hover:text-lightBlue-600 hover:border-lightBlue-500 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center gap-2"
                  title={t("profile.view_public", "Xem trang công khai")}
                >
                   <span>View Public</span> <i className="fas fa-external-link-alt"></i>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                   <div className="relative">
                      {profile.avatarUrl ? (
                          <img alt="Avatar" 
                               src={profile.avatarUrl} 
                               className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px bg-white object-cover" 
                               style={{ width: "150px", height: "150px" }} />
                      ) : (
                          <div className="shadow-xl rounded-full absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px bg-blueGray-200 flex items-center justify-center text-blueGray-400 border-4 border-white"
                               style={{ width: "150px", height: "150px" }}>
                              <i className="fas fa-user text-6xl"></i>
                          </div>
                      )}
                      
                      <button
                        className="absolute bg-blueGray-700 hover:bg-lightBlue-500 text-white p-2 rounded-full shadow-lg transition-all duration-200 border-2 border-white flex items-center justify-center"
                        style={{ 
                            width: "30px", height: "30px",
                            bottom: "-70px",
                            left: "50px"
                        }}
                        type="button"
                        onClick={() => toast.info(t("feature.coming_soon", "Tính năng đổi Avatar đang phát triển"))}
                        title="Đổi ảnh đại diện"
                      >
                        <i className="fas fa-camera text-xs"></i>
                      </button>

                   </div>
                </div>
              </div>
              <div className="text-center mt-24"> 
              </div>

              <div className="mt-10 py-10 border-t border-blueGray-200">
                <div className="flex flex-wrap">
                  
                  {/* Cột trái */}
                  <div className="w-full lg:w-4/12 px-4 mb-8">
                      {/* Contact Info */}
                      <div className="mb-6 bg-blueGray-50 p-4 rounded-lg border border-blueGray-100">
                         <h4 className="text-xl font-bold text-blueGray-700 mb-3">{t("profile.contact_info", "Liên hệ")}</h4>
                         <div className="text-sm text-blueGray-600 font-medium py-1 flex items-center">
                             <i className="fas fa-envelope w-5 text-center mr-2"></i> {authService.getCurrentUser()?.email}
                         </div>
                         <div className="text-sm text-blueGray-600 font-medium py-1 flex items-center">
                             <i className="fas fa-phone w-5 text-center mr-2"></i> {profile.phone || "---"}
                         </div>
                         <div className="text-sm text-blueGray-600 font-medium py-1 flex items-center">
                             <i className="fas fa-map-marker-alt w-5 text-center mr-2"></i> {profile.address || "---"}
                         </div>
                      </div>

                      <CVCard profile={profile} onUploadSuccess={fetchProfile} />
                      
                      <div className="mt-6">
                         <SkillsCard 
                            skills={profile.skills || []}
                            onAdd={() => openModal('skill')}
                            onDelete={(id) => handleDelete('skill', id)}
                         />
                      </div>
                  </div>

                  {/* Cột phải */}
                  <div className="w-full lg:w-8/12 px-4">
                      <AboutCard 
                         profile={profile} 
                         onEdit={() => openModal('about', profile)} 
                      />
                      <hr className="my-8 border-blueGray-200" />
                      
                      <ExperienceCard 
                         experiences={profile.experiences || []}
                         onAdd={() => openModal('experience')}
                         onEdit={(item) => openModal('experience', item)}
                         onDelete={(id) => handleDelete('experience', id)}
                      />
                      <hr className="my-8 border-blueGray-200" />

                      <EducationCard 
                         educations={profile.educations || []}
                         onAdd={() => openModal('education')}
                         onEdit={(item) => openModal('education', item)}
                         onDelete={(id) => handleDelete('education', id)}
                      />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals render... */}
      {modalType === 'education' && ( <EducationModal isOpen={true} onClose={closeModal} onSubmit={handleEducationSubmit} initialData={editingItem} /> )}
      {modalType === 'experience' && ( <ExperienceModal isOpen={true} onClose={closeModal} onSubmit={handleExperienceSubmit} initialData={editingItem} /> )}
      {modalType === 'skill' && ( <SkillModal isOpen={true} onClose={closeModal} onSubmit={handleSkillSubmit} /> )}
      {modalType === 'about' && ( <AboutModal isOpen={true} onClose={closeModal} onSubmit={handleAboutSubmit} initialData={editingItem} /> )}
    </>
  );
}