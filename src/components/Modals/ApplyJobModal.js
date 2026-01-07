import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function ApplyJobModal({ 
    isOpen, 
    onClose, 
    jobTitle, 
    companyName, 
    cvUrl, 
    onConfirm 
}) {
  const { t } = useTranslation();
  const [coverLetter, setCoverLetter] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSending(true);
    try {
        // Call parent's onConfirm (API logic in parent)
        await onConfirm({ coverLetter });
        setCoverLetter(""); 
    } catch (error) {
        // Error handled in parent
    } finally {
        setIsSending(false);
    }
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-4">
        <div className="relative w-full my-6 mx-auto max-w-xl">
          <div className="border-0 rounded-lg shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none">
            
            {/* HEADER */}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-xl font-bold text-blueGray-700">
                <i className="fas fa-paper-plane mr-2 text-brand"></i>
                {t('apply_job')}
              </h3>
              <button
                className="p-1 ml-auto border-0 text-blueGray-400 hover:text-red-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none transition-colors"
                onClick={onClose}
              >
                <span className="block h-6 w-6 text-2xl outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>

            {/* BODY */}
            <div className="relative p-6 flex-auto">
              <div className="mb-4 bg-lightBlue-50 p-4 rounded-lg border border-lightBlue-100">
                <p className="text-sm text-blueGray-600">
                  {t('applying_for')}:
                </p>
                <h4 className="text-lg font-bold text-blueGray-800 uppercase mt-1">{jobTitle}</h4>
                <p className="text-sm font-semibold text-brand mt-1">
                  <i className="fas fa-building mr-1"></i> {companyName}
                </p>
              </div>

              {/* Check CV Status */}
              <div className="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <label className="text-xs font-bold uppercase text-emerald-700 block mb-2">
                      <i className="fas fa-file-pdf mr-2"></i>
                      CV
                  </label>
                  {cvUrl ? (
                      <div className="flex items-center justify-between">
                          <span className="text-sm text-emerald-600 font-medium">
                              {t('cv_ready')}
                          </span>
                          <a 
                            href={cvUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs bg-white text-emerald-600 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                              {t('preview')}
                          </a>
                      </div>
                  ) : (
                      <div className="text-red-500 text-sm font-bold flex items-center">
                          <i className="fas fa-exclamation-triangle mr-2"></i> 
                          {t('no_cv_warning')}
                      </div>
                  )}
              </div>

              {/* Cover Letter Input */}
              <div className="mt-4">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      {t('cover_letter')} 
                      <span className="text-blueGray-400 lowercase font-normal ml-1">({t('optional')})</span>
                  </label>
                  <textarea
                      rows="5"
                      className="border border-blueGray-200 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-blueGray-50 rounded text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand w-full ease-linear transition-all duration-150"
                      placeholder={t('cover_letter_placeholder')}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                  />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-blueGray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-4 mb-1 ease-linear transition-all duration-150 hover:text-blueGray-700"
                type="button"
                onClick={onClose}
                disabled={isSending}
              >
                {t('cancel')}
              </button>
              
              <button
                className="bg-brand text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150 disabled:opacity-50 flex items-center"
                type="button"
                onClick={handleSubmit}
                disabled={isSending || !cvUrl}
              >
                {isSending ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i> {t('sending')}</>
                ) : (
                    <><i className="fas fa-check mr-2"></i> {t('confirm_apply')}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

ApplyJobModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    jobTitle: PropTypes.string,
    companyName: PropTypes.string,
    cvUrl: PropTypes.string,
    onConfirm: PropTypes.func
};