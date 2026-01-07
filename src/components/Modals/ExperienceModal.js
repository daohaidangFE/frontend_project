import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  companyName: '',
  position: '',
  description: '',
  achievement: '',
  startDate: '',
  endDate: '',
};

export default function ExperienceModal({ isOpen, onClose, onSubmit, initialData }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          companyName: initialData.companyName || '',
          position: initialData.position || '',
          description: initialData.description || '',
          achievement: initialData.achievement || '',
          startDate: initialData.startDate || '',
          endDate: initialData.endDate || '',
        });
        setIsCurrentlyWorking(!initialData.endDate);
      } else {
        setFormData(INITIAL_STATE);
        setIsCurrentlyWorking(false);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsCurrentlyWorking(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, endDate: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      endDate: isCurrentlyWorking ? null : formData.endDate,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black opacity-50" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-blueGray-200">
            <h3 className="text-xl font-bold text-blueGray-700">
              {initialData ? t('edit_experience') : t('add_experience')}
            </h3>
            <button onClick={onClose} className="text-black opacity-50 text-2xl font-semibold">×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              
              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                    {t('company_name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 rounded shadow text-sm bg-white border border-blueGray-200 focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                    {t('position')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 rounded shadow text-sm bg-white border border-blueGray-200 focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                      {t('start_date')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 rounded shadow text-sm bg-white border border-blueGray-200 focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                      {t('end_date')}
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={isCurrentlyWorking}
                    className={`w-full px-3 py-3 rounded shadow text-sm border border-blueGray-200 focus:outline-none focus:ring-1 focus:ring-lightBlue-500 ${
                      isCurrentlyWorking ? 'bg-blueGray-100 text-blueGray-400' : 'bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Checkbox Currently Working */}
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isCurrentlyWorking} 
                    onChange={handleCheckboxChange} 
                    className="w-5 h-5 rounded border-blueGray-300 text-lightBlue-500 focus:ring-lightBlue-500" 
                  />
                  <span className="ml-2 text-sm font-semibold text-blueGray-600 select-none">
                      {t('currently_working')}
                  </span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                    {t('description')}
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-3 rounded shadow text-sm bg-white border border-blueGray-200 focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                ></textarea>
              </div>

              {/* Achievement */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                    {t('achievement')}
                </label>
                <textarea
                  name="achievement"
                  rows="2"
                  value={formData.achievement}
                  onChange={handleChange}
                  placeholder={t('achievement_placeholder')}
                  className="w-full px-3 py-3 rounded shadow text-sm bg-white border border-blueGray-200 focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                ></textarea>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end p-6 border-t border-blueGray-200 bg-blueGray-50 rounded-b-lg">
              <button 
                type="button" 
                onClick={onClose} 
                className="text-red-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-50 rounded"
              >
                {t('cancel')}
              </button>
              <button 
                type="submit" 
                className="bg-lightBlue-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              >
                {initialData ? t('update') : t('create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

ExperienceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};