import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import cvService from "services/cvService";
import applyingService from "services/applyingService";

export default function ApplyModal({ show, setShow, jobPostId, jobTitle }) {
  const { t } = useTranslation(); // 2. Khởi tạo t
  
  const [cvs, setCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [selectedCvName, setSelectedCvName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load CV list when modal opens
  useEffect(() => {
    if (show) {
      resetForm();
      fetchMyCVs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const resetForm = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setCoverLetter("");
    setLoading(false);
  };

  const fetchMyCVs = async () => {
    try {
      const res = await cvService.getMyCVs();
      
      // Safe data retrieval logic
      let listCvs = [];
      if (Array.isArray(res)) listCvs = res;
      else if (res.data && Array.isArray(res.data)) listCvs = res.data;
      else if (res.data && res.data.data && Array.isArray(res.data.data)) listCvs = res.data.data;
      else if (res.result && Array.isArray(res.result)) listCvs = res.result;

      setCvs(listCvs);

      if (listCvs.length > 0) {
        // Default to latest CV
        const defaultCv = listCvs.find(cv => cv.default === true) || listCvs[listCvs.length - 1];
        
        setSelectedCvId(defaultCv.id);
        setSelectedCvName(defaultCv.cvName || `CV #${defaultCv.id}`);
      }
    } catch (err) {
      setErrorMessage(t('error')); // General error
    }
  };

  const handleApply = async () => {
    if (!selectedCvId) {
      setErrorMessage(t('no_cv_to_apply'));
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        jobPostId: jobPostId,
        cvId: parseInt(selectedCvId),
        coverLetter: coverLetter,
      };

      await applyingService.applyJob(payload);
      
      setSuccessMessage(t('apply_success_msg'));
      
      setTimeout(() => {
        setShow(false);
      }, 2000);

    } catch (err) {
      const msg = err.response?.data?.message || t('error');
      if (msg.includes("already applied")) {
        setErrorMessage(t('already_applied_error'));
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/* CONTENT */}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-w-[350px] md:min-w-[500px]">
            
            {/* HEADER */}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <div>
                <h3 className="text-2xl font-semibold text-blueGray-700">
                  {t('apply_now')}
                </h3>
                <p className="text-sm text-blueGray-500 mt-1">
                  {t('position_label')}: <span className="font-bold text-emerald-600">{jobTitle}</span>
                </p>
              </div>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShow(false)}
              >
                <span className="text-black opacity-5 h-6 w-6 text-2xl block">×</span>
              </button>
            </div>
            
            {/* BODY */}
            <div className="relative p-6 flex-auto">
              {errorMessage && <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-sm">{errorMessage}</div>}
              {successMessage && <div className="bg-emerald-500 text-white px-4 py-2 rounded mb-4 text-sm">{successMessage}</div>}

              <form>
                  {/* --- CV DISPLAY (Default Latest) --- */}
                  <div className="mb-4">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t('cv_selection_label')}
                    </label>
                    
                    {cvs.length > 0 ? (
                        <div className="flex items-center p-3 bg-lightBlue-50 border border-lightBlue-200 rounded text-blueGray-700 font-semibold">
                            <i className="fas fa-file-pdf text-red-500 text-xl mr-3"></i>
                            <div className="flex-1">
                                {selectedCvName}
                            </div>
                            <span className="text-[10px] bg-emerald-500 text-white px-2 py-1 rounded uppercase font-bold">
                              {cvs.find(c => c.id === selectedCvId)?.default 
                                ? t('default_tag', 'Mặc định') 
                                : t('latest_tag', 'Mới nhất')}
                          </span>
                        </div>
                    ) : (
                        <div className="text-sm text-orange-500 bg-orange-100 p-3 rounded border border-orange-200">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {t('no_cv_text')} 
                            <Link to="/student/cv-management" className="ml-1 font-bold underline text-orange-600 hover:text-orange-800">
                                {t('upload_cv_link')}
                            </Link>
                        </div>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div className="mb-4">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t('cover_letter')}
                    </label>
                    <textarea
                        rows="4"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-blueGray-100 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 resize-none"
                        placeholder={t('cover_letter_placeholder')}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>
              </form>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShow(false)}
              >
                {t('close')}
              </button>
              
              {!successMessage && (
                  <button
                    className={`bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${loading || cvs.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    type="button"
                    onClick={handleApply}
                    disabled={loading || cvs.length === 0}
                  >
                    {loading ? t('sending') : t('submit_application')}
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}