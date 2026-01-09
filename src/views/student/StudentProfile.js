import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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
import ConfirmModal from "components/Modals/ConfirmModal";
import AvatarUploadModal from "components/Modals/AvatarUploadModal";

// Services
import profileService from "services/profileService";
import authService from "services/authService";
import cvService from "services/cvService";

export default function Profile() {
  const { t } = useTranslation();
  
  const [showCVPreview, setShowCVPreview] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  // State Data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // State Modal Form
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
      isOpen: false,
      type: null, 
      id: null
  });

  const fetchProfile = async () => {
    try {
      const [studentData, educations, experiences, skills, cvList] = await Promise.all([
        profileService.getStudentProfile(),
        profileService.getAllEducations().catch(() => []),
        profileService.getAllExperiences().catch(() => []),
        profileService.getAllSkills().catch(() => []),
        cvService.getMyCVs().catch(() => [])
      ]);

      let displayCv = cvList.find(cv => cv.default === true);

      if (!displayCv && cvList.length > 0) {
        displayCv = [...cvList].sort((a, b) => b.id - a.id)[0];
      }

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
      toast.error(t("load_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // --- 2. HANDLERS FOR MODALS ---
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
  };

  // --- 3. SUBMIT HANDLERS ---
  const handleAboutSubmit = async (formData) => {
    try {
        await profileService.updateBasicProfile(formData);
        toast.success(t("update_success"));
        closeModal(); 
        fetchProfile();
    } catch (error) {
        console.error(error);
    }
  };

  const handleEducationSubmit = async (formData) => {
    try {
        if(editingItem) await profileService.updateEducation(editingItem.id, formData);
        else await profileService.addEducation(formData);
        
        toast.success(editingItem ? t("update_success") : t("create_success"));
        closeModal(); 
        fetchProfile();
    } catch (error) {
        console.error(error);
    }
  };

  const handleExperienceSubmit = async (formData) => {
    try {
        if(editingItem) await profileService.updateExperience(editingItem.id, formData);
        else await profileService.addExperience(formData);

        toast.success(editingItem ? t("update_success") : t("create_success"));
        closeModal(); 
        fetchProfile();
    } catch (error) {
        console.error(error);
    }
  };

  const handleSkillSubmit = async (formData) => {
    try {
        await profileService.addSkill(formData);
        toast.success(t("create_success"));
        closeModal(); 
        fetchProfile();
    } catch (error) {
        console.error(error);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      await profileService.updateAvatar(file);
      toast.success(t("avatar_updated_success", "Cập nhật ảnh đại diện thành công"));
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error(t("avatar_update_error", "Không thể cập nhật ảnh đại diện"));
      throw error;
    }
  };

  // --- 4. DELETE HANDLERS ---
  const requestDelete = (type, id) => {
      setConfirmModal({ isOpen: true, type, id });
  };

  const confirmDelete = async () => {
      const { type, id } = confirmModal;
      try {
        if (type === 'education') await profileService.deleteEducation(id);
        if (type === 'experience') await profileService.deleteExperience(id);
        if (type === 'skill') await profileService.deleteSkill(id);

        toast.success(t("delete_success"));
        fetchProfile();
      } catch (error) {
          console.error(error);
      } finally {
          setConfirmModal({ isOpen: false, type: null, id: null });
      }
  };

  if (loading) return (
      <div className="min-h-screen flex justify-center items-center">
          <i className="fas fa-spinner fa-spin text-4xl text-lightBlue-500"></i>
      </div>
  );

  if (!profile) return <div className="p-10 text-center text-red-500 font-bold">Profile not found</div>;

  const currentUser = authService.getCurrentUser();

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
              <p className="mt-4 text-lg text-gray-300">{profile.headline || t("intern_student")}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6 relative">
              
              <div className="absolute top-4 right-4 flex flex-wrap gap-3">
                <Link
                  to="/student/my-applications"
                  className="bg-blueGray-700 hover:bg-blueGray-800 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center gap-2"
                >
                  <i className="fas fa-file-alt"></i>
                  <span>{t("my_applications", "Hồ sơ đã nộp")}</span>
                </Link>
              </div>

              {/* Avatar Section */}
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
                      
                      {/* Button Edit Avatar */}
                      <button
                        className="absolute bg-blueGray-700 hover:bg-lightBlue-500 text-white p-2 rounded-full shadow-lg transition-all duration-200 border-2 border-white flex items-center justify-center cursor-pointer"
                        style={{ width: "30px", height: "30px", bottom: "-70px", left: "50px" }}
                        type="button"
                        onClick={() => setShowAvatarModal(true)}
                      >
                        <i className="fas fa-camera text-xs"></i>
                      </button>
                   </div>
                </div>
              </div>
              
              <div className="text-center mt-24"></div>

              {/* MAIN CONTENT SPLIT */}
              <div className="mt-10 py-10 border-t border-blueGray-200">
                <div className="flex flex-wrap">
                  
                  {/* === LEFT COLUMN === */}
                  <div className="w-full lg:w-4/12 px-4 mb-8">
                      {/* Contact Info */}
                      <div className="mb-6 bg-blueGray-50 p-4 rounded-lg border border-blueGray-100">
                         <h4 className="text-xl font-bold text-blueGray-700 mb-3">{t("contact_info")}</h4>
                         <div className="text-sm text-blueGray-600 font-medium py-1 flex items-center">
                             <i className="fas fa-envelope w-5 text-center mr-2 text-blueGray-400"></i> {currentUser?.email}
                         </div>
                         <div className="text-sm text-blueGray-600 font-medium py-1 flex items-center">
                             <i className="fas fa-phone w-5 text-center mr-2 text-blueGray-400"></i> {profile.phone || "---"}
                         </div>
                         <div className="text-sm text-blueGray-600 font-medium py-1 flex items-center">
                             <i className="fas fa-map-marker-alt w-5 text-center mr-2 text-blueGray-400"></i> {profile.address || "---"}
                         </div>
                      </div>

                      {/* CV Card */}
                      <CVCard profile={profile} onUploadSuccess={fetchProfile} onPreview={() => setShowCVPreview(true)} />
                      
                      {/* Skills Card */}
                      <div className="mt-6">
                         <SkillsCard 
                            skills={profile.skills || []}
                            onAdd={() => openModal('skill')}
                            onDelete={(id) => requestDelete('skill', id)}
                         />
                      </div>
                  </div>

                  {/* === RIGHT COLUMN === */}
                  <div className="w-full lg:w-8/12 px-4">
                      {/* About Card */}
                      <AboutCard 
                          profile={profile} 
                          onEdit={() => openModal('about', profile)} 
                      />
                      <hr className="my-8 border-blueGray-200" />
                      
                      {/* Experience Card */}
                      <ExperienceCard 
                          experiences={profile.experiences || []}
                          onAdd={() => openModal('experience')}
                          onEdit={(item) => openModal('experience', item)}
                          onDelete={(id) => requestDelete('experience', id)}
                      />
                      <hr className="my-8 border-blueGray-200" />

                      {/* Education Card */}
                      <EducationCard 
                          educations={profile.educations || []}
                          onAdd={() => openModal('education')}
                          onEdit={(item) => openModal('education', item)}
                          onDelete={(id) => requestDelete('education', id)}
                      />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODALS --- */}
      <EducationModal 
          isOpen={modalType === 'education'} 
          onClose={closeModal} 
          onSubmit={handleEducationSubmit} 
          initialData={editingItem} 
      />
      
      <ExperienceModal 
          isOpen={modalType === 'experience'} 
          onClose={closeModal} 
          onSubmit={handleExperienceSubmit} 
          initialData={editingItem} 
      />
      
      <SkillModal 
          isOpen={modalType === 'skill'} 
          onClose={closeModal} 
          onSubmit={handleSkillSubmit} 
      />
      
      <AboutModal 
          isOpen={modalType === 'about'} 
          onClose={closeModal} 
          onSubmit={handleAboutSubmit} 
          initialData={editingItem} 
      />

      <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmDelete}
          title={t("confirm_delete_title")}
          message={t("confirm_delete_message")}
          isDanger={true}
      />

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onUploadSuccess={handleAvatarUpload}
        currentAvatarUrl={profile?.avatarUrl}
      />

      {/* CV Preview Modal */}
      {showCVPreview && profile?.cvUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black opacity-60 z-[9998]"
            onClick={() => setShowCVPreview(false)}
          ></div>
          <div 
            className="relative w-full max-w-2xl bg-white shadow-2xl rounded-lg overflow-hidden z-[9999] flex flex-col" 
            style={{ height: '80vh' }}
          >
            <div className="flex-none flex items-center justify-between px-4 py-3 border-b bg-blueGray-50">
              <h3 className="text-lg font-bold text-blueGray-700">
                <i className="fas fa-file-pdf mr-2 text-red-500"></i>
                {t("cv_preview", "Xem trước CV")}
              </h3>
              <button
                className="text-blueGray-400 hover:text-red-500 text-2xl outline-none"
                onClick={() => setShowCVPreview(false)}
              >
                &times;
              </button>
            </div>
            <div className="flex-1 w-full overflow-auto">
              <iframe
                src={`${profile.cvUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=1`}
                title="CV Preview"
                className="w-full border-none"
                style={{ minHeight: '1000px', height: '100%' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}