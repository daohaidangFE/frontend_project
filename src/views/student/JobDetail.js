import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import apiClient from "services/apiClient";
import profileService from "services/profileService";
import ApplyModal from "components/Modals/ApplyModal";
import { useAuth } from "context/AuthContext";
import moment from "moment";

export default function JobDetail() {
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    async function fetchJobData() {
      try {
        setLoading(true);
        const res = await apiClient.get(`/internship-post/detail`, {
          params: { postId: id }
        });

        let jobData = res.data.data;

        if (jobData?.companyId) {
          try {
            const companyRes = await apiClient.get(`/profile/v1/companies/${jobData.companyId}`);
            jobData = { ...jobData, company: companyRes.data.data };
          } catch (err) {
            console.warn("Company fetch failed");
          }
        }
        setJob(jobData);
      } catch (error) {
        toast.error("Không tìm thấy bài đăng");
        history.push("/student/jobs");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJobData();
  }, [id, history]);

  if (loading) return <div className="text-center mt-20"><i className="fas fa-circle-notch fa-spin text-4xl text-emerald-500"></i></div>;
  if (!job) return null;

  const getSkillStyle = (level) => {
    if (level === 'HIGH') return "bg-red-50 text-red-700 border-red-100";
    if (level === 'MEDIUM') return "bg-orange-50 text-orange-700 border-orange-100";
    return "bg-blueGray-50 text-blueGray-700 border-blueGray-100";
  };

  return (
    <div className="bg-blueGray-100 min-h-screen pb-20">
      {/* HEADER: Hiển thị Title, Position và Company */}
      <div className="relative bg-blueGray-800 md:pt-32 pb-40 pt-12">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center">
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-lg mr-6">
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt="logo" className="w-12 h-12 object-contain" />
              ) : (
                <i className="fas fa-building text-3xl text-blueGray-300" />
              )}
            </div>
            <div className="flex-1 text-white">
              <div className="flex gap-2 mb-2">
                <span className="bg-emerald-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{job.status}</span>
                <span className="bg-lightBlue-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{job.position}</span>
              </div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <p className="text-blueGray-400 mt-1">{job.company?.name || "Đang cập nhật công ty..."}</p>
            </div>
            <button 
              onClick={() => setShowApplyModal(true)}
              className="mt-4 md:mt-0 bg-emerald-500 text-white px-8 py-3 rounded font-bold uppercase text-sm hover:bg-emerald-600 transition-all shadow-lg"
            >
              {t("apply_now")}
            </button>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-8/12 px-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* DESCRIPTION */}
              <div className="mb-8">
                <h6 className="text-blueGray-400 text-sm font-bold uppercase mb-4 border-b pb-2">{t("job_description_title")}</h6>
                <p className="text-blueGray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              {/* SKILLS: Hiển thị mảng skills từ response */}
              {job.skills?.length > 0 && (
                <div>
                  <h6 className="text-blueGray-400 text-sm font-bold uppercase mb-4 border-b pb-2">{t("technical_skills")}</h6>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map((s) => (
                      <div key={s.id} className={`flex flex-col px-3 py-2 rounded border ${getSkillStyle(s.importanceLevel)}`}>
                        <span className="font-bold text-sm">{s.skillName}</span>
                        <span className="text-[10px] opacity-80 italic">{s.importanceLevel} {s.note && `- ${s.note}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR: Các trường info còn lại */}
          <div className="w-full lg:w-4/12 px-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h6 className="text-blueGray-400 text-sm font-bold uppercase mb-6 border-b pb-2">
                {t("job_summary")}
              </h6>
              
              <SidebarItem 
                icon="fa-map-marker-alt" 
                label={t("location")} 
                value={job.location} 
              />
              <SidebarItem 
                icon="fa-briefcase" 
                label={t("work_mode")} 
                value={t(job.workMode?.toLowerCase())} // i18n luôn cả giá trị Enum (onsite, remote...)
              />
              <SidebarItem 
                icon="fa-clock" 
                label={t("duration")} 
                value={job.duration} 
              />
              <SidebarItem 
                icon="fa-calendar-alt" 
                label={t("posted_at")} 
                value={moment(job.createdAt).format("DD/MM/YYYY")} 
              />
              <SidebarItem 
                icon="fa-calendar-times" 
                label={t("expired_at")} 
                value={moment(job.expiredAt).format("DD/MM/YYYY")} 
              />
              
              <div className="mt-8 pt-6 border-t border-blueGray-100">
                <p className="text-xs text-blueGray-400 italic leading-relaxed">
                  {t("cv_tip_skills", { 
                    skills: job.skills?.slice(0, 3).map(s => s.skillName).join(", ") 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplyModal show={showApplyModal} setShow={setShowApplyModal} jobPostId={id} jobTitle={job.title} />
    </div>
  );
}

function SidebarItem({ icon, label, value }) {
  return (
    <div className="flex items-start mb-4 last:mb-0">
      <div className="text-blueGray-400 mt-1 w-5 text-center"><i className={`fas ${icon}`}></i></div>
      <div className="ml-4">
        <p className="text-[10px] text-blueGray-400 font-bold uppercase leading-none">{label}</p>
        <p className="text-sm text-blueGray-700 font-semibold mt-1">{value || "N/A"}</p>
      </div>
    </div>
  );
}