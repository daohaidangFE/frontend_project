import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  school: '',
  major: '',
  degree: 'BACHELOR',
  gpa: '',
  description: '',
  startDate: '',
  endDate: '',
};

export default function EducationModal({ isOpen, onClose, onSubmit, initialData }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          school: initialData.school || '',
          major: initialData.major || '',
          degree: initialData.degree || 'BACHELOR',
          gpa: initialData.gpa || '',
          description: initialData.description || '',
          startDate: initialData.startDate || '',
          endDate: initialData.endDate || '',
        });
        setIsCurrentlyStudying(!initialData.endDate);
      } else {
        setFormData(INITIAL_STATE);
        setIsCurrentlyStudying(false);
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
    setIsCurrentlyStudying(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, endDate: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      gpa: formData.gpa ? parseFloat(formData.gpa) : null,
      endDate: isCurrentlyStudying ? null : formData.endDate,
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
              {initialData ? t('edit_education') : t('add_education')}
            </h3>
            <button onClick={onClose} className="text-black opacity-50 text-2xl font-semibold">×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              
              {/* School */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                    {t('school')} <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    name="school" 
                    value={formData.school} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-500" 
                />
              </div>
              
              {/* Major */}
              <div>
                 <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">{t('major')}</label>
                 <input 
                    type="text" 
                    name="major" 
                    value={formData.major} 
                    onChange={handleChange} 
                    className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-500" 
                 />
              </div>

              {/* Degree & GPA */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">{t('degree')}</label>
                   <select 
                      name="degree" 
                      value={formData.degree} 
                      onChange={handleChange} 
                      className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 bg-white focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                   >
                     <option value="HIGH_SCHOOL">{t('degree_high_school')}</option>
                     <option value="COLLEGE">{t('degree_college')}</option>
                     <option value="BACHELOR">{t('degree_bachelor')}</option>
                     <option value="MASTER">{t('degree_master')}</option>
                     <option value="PHD">{t('degree_phd')}</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">{t('gpa')}</label>
                   <input 
                      type="number" 
                      name="gpa" 
                      step="0.01" 
                      min="0" 
                      max="10" // Tuỳ thang điểm
                      value={formData.gpa} 
                      onChange={handleChange} 
                      placeholder="e.g. 3.5"
                      className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-500" 
                   />
                 </div>
              </div>
               
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">{t('start_date')}</label>
                   <input 
                      type="date" 
                      name="startDate" 
                      value={formData.startDate} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-500" 
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">{t('end_date')}</label>
                   <input 
                      type="date" 
                      name="endDate" 
                      value={formData.endDate} 
                      onChange={handleChange} 
                      disabled={isCurrentlyStudying} 
                      className={`w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-500 ${isCurrentlyStudying ? 'bg-blueGray-100 cursor-not-allowed' : ''}`} 
                   />
                 </div>
              </div>

              {/* Checkbox Currently Studying */}
              <label className="inline-flex items-center mt-2 cursor-pointer">
                 <input 
                    type="checkbox" 
                    checked={isCurrentlyStudying} 
                    onChange={handleCheckboxChange} 
                    className="w-5 h-5 rounded border-blueGray-300 text-lightBlue-500 focus:ring-lightBlue-500" 
                 />
                 <span className="ml-2 text-sm text-blueGray-600 select-none">{t('currently_studying')}</span>
              </label>

              {/* Description */}
              <div>
                 <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">{t('description')}</label>
                 <textarea 
                    name="description" 
                    rows="3" 
                    value={formData.description} 
                    onChange={handleChange} 
                    className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
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
                {initialData ? t('save') : t('create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

EducationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object
};