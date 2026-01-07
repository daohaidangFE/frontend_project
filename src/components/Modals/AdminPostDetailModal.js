import React from "react";
import { useTranslation } from "react-i18next";

export default function AdminPostDetailModal({ isOpen, onClose, post, onApprove, onReject }) {
  const { t } = useTranslation();

  if (!isOpen || !post) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black opacity-50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none focus:outline-none">
        <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t bg-blueGray-50">
            <h3 className="text-xl font-bold text-blueGray-700 uppercase">
              <i className="fas fa-file-alt mr-2 text-brand"></i>
              {t('admin_review_post')}
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black opacity-30 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:opacity-50"
              onClick={onClose}
            >
              <span>×</span>
            </button>
          </div>

          {/* Body */}
          <div className="relative p-6 flex-auto overflow-y-auto">
            <div className="flex flex-wrap">
              {/* Cột trái: Thông tin chính */}
              <div className="w-full lg:w-8/12 pr-4 border-r border-blueGray-100">
                <h4 className="text-2xl font-bold text-blueGray-800 mb-2">{post.title}</h4>
                <div className="flex items-center text-sm text-blueGray-500 mb-4">
                  <i className="fas fa-building mr-2"></i>
                  <span className="font-semibold">{post.companyName || t('unknown_company')}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
                    {post.workMode}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-lightBlue-100 text-lightBlue-700 border border-lightBlue-200">
                    {post.position}
                  </span>
                </div>

                <div className="mb-6">
                  <h5 className="text-sm font-bold uppercase text-blueGray-400 mb-3 border-b pb-1">
                    {t('job_description')}
                  </h5>
                  <div className="text-blueGray-600 text-sm leading-relaxed whitespace-pre-line">
                    {post.description}
                  </div>
                </div>
              </div>

              {/* Cột phải: Kỹ năng & Meta data */}
              <div className="w-full lg:w-4/12 pl-4">
                <div className="mb-6">
                  <h5 className="text-sm font-bold uppercase text-blueGray-400 mb-3 border-b pb-1">
                    {t('required_skills')}
                  </h5>
                  <div className="flex flex-col gap-2">
                    {post.skills && post.skills.length > 0 ? (
                      post.skills.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-blueGray-50 rounded border border-blueGray-100">
                          <span className="text-xs font-bold text-blueGray-700">{s.skillName}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            s.importanceLevel === 'MANDATORY' ? 'bg-red-500 text-white' : 'bg-orange-400 text-white'
                          }`}>
                            {s.importanceLevel}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs italic text-blueGray-400">{t('no_skills_required')}</p>
                    )}
                  </div>
                </div>

                <div className="bg-blueGray-100 p-4 rounded text-xs text-blueGray-600 space-y-2">
                  <p><strong>{t('post_id')}:</strong> <span className="text-blueGray-800">{post.id}</span></p>
                  <p><strong>{t('created_at')}:</strong> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
                  <p><strong>{t('current_status')}:</strong> 
                    <span className="ml-2 font-bold text-orange-500 uppercase">{post.status}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b bg-blueGray-50">
            <button
              className="text-blueGray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-4 hover:text-blueGray-700 transition-all"
              type="button"
              onClick={onClose}
            >
              {t('close')}
            </button>
            
            <button
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 transition-all"
              type="button"
              onClick={() => onReject(post.id)}
            >
              <i className="fas fa-times mr-2"></i> {t('reject')}
            </button>

            <button
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none transition-all"
              type="button"
              onClick={() => onApprove(post.id)}
            >
              <i className="fas fa-check mr-2"></i> {t('approve')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}