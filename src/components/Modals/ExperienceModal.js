import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  projectName: '',
  companyName: '',
  role: '',
  description: '',
  startDate: '',
  endDate: '',
};

export default function ExperienceModal({ isOpen, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setIsCurrentlyWorking(e.target.checked);
    if (e.target.checked) {
      setFormData((prev) => ({ ...prev, endDate: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(INITIAL_STATE);
    setIsCurrentlyWorking(false);
    onClose();
  };

  const handleClose = () => {
    setFormData(INITIAL_STATE);
    setIsCurrentlyWorking(false);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black opacity-50 transition-opacity"
        onClick={handleClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-full max-w-lg p-6 mx-auto">
          <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-2xl font-semibold">
                {t('add_experience', 'Add Experience')}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={handleClose}
              >
                <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  &times;
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="relative p-6 flex-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-1">
                    <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
                      {t('company_name', 'Company Name')}
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
                      {t('role', 'Role')}*
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
                      {t('project_name', 'Project Name')}
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      className="text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
                      {t('start_date', 'Start Date')}*
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
                      {t('end_date', 'End Date')}
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      disabled={isCurrentlyWorking}
                      className={`text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand ${
                        isCurrentlyWorking ? 'bg-blueGray-100' : ''
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCurrentlyWorking}
                        onChange={handleCheckboxChange}
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        {t('currently_working_here', 'I am currently working here')}
                      </span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
                      {t('description', 'Description')}
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      className="text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-blueGray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleClose}
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  className="bg-brand text-white active:bg-brand/90 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="submit"
                >
                  {t('save', 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

ExperienceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
