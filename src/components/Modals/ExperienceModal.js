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

          <div className="flex items-center justify-between p-5 border-b border-blueGray-200">
            <h3 className="text-xl font-bold text-blueGray-700">
              {initialData ? t('edit_experience') : t('add_experience')}
            </h3>
            <button onClick={onClose} className="text-black opacity-50 text-2xl font-semibold">×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2">{t('company_name')} *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 rounded shadow text-sm bg-white border border-blueGray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2">{t('position')} *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 rounded shadow text-sm bg-white border border-blueGray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2">{t('start_date')} *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-3 rounded shadow text-sm bg-white border border-blueGray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2">{t('end_date')}</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={isCurrentlyWorking}
                    className={`w-full px-3 py-3 rounded shadow text-sm border border-blueGray-200 ${
                      isCurrentlyWorking ? 'bg-gray-100 text-gray-400' : 'bg-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isCurrentlyWorking} onChange={handleCheckboxChange} className="w-5 h-5" />
                  <span className="ml-2 text-sm font-semibold text-blueGray-600">{t('currently_working')}</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2">{t('description')}</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-3 rounded shadow text-sm bg-white border border-blueGray-200"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2">{t('achievement')}</label>
                <textarea
                  name="achievement"
                  rows="2"
                  value={formData.achievement}
                  onChange={handleChange}
                  placeholder={t('achievement_placeholder', 'Ví dụ: Đạt giải nhân viên xuất sắc tháng...')}
                  className="w-full px-3 py-3 rounded shadow text-sm bg-white border border-blueGray-200"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t border-blueGray-200">
              <button type="button" onClick={onClose} className="text-red-500 font-bold uppercase px-6 py-2 text-sm">{t('cancel')}</button>
              <button type="submit" className="bg-brand text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:bg-opacity-90 transition-all">
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