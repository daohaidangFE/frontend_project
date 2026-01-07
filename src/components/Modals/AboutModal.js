import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function AboutModal({ isOpen, onClose, onSubmit, initialData }) {
  const { t } = useTranslation();
  
  // State form
  const [formData, setFormData] = useState({
    bio: '',
    dob: '',
    gender: 'MALE',
    phone: '', 
    address: ''
  });

  // Khai báo option giới tính bên trong để dùng t()
  const genderOptions = [
    { value: 'MALE', label: t('male') },
    { value: 'FEMALE', label: t('female') }
  ];

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        bio: initialData.bio || '',
        dob: initialData.dob || '',
        gender: initialData.gender || 'MALE',
        phone: initialData.phone || '',
        address: initialData.address || ''
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black opacity-50" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-blueGray-200">
            <h3 className="text-xl font-bold text-blueGray-700">
              {t('update_profile_title')}
            </h3>
            <button onClick={onClose} className="text-black opacity-50 text-2xl font-semibold">×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              
              {/* Giới thiệu */}
              <div>
                <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                    {t('about_me')}
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder={t('bio_placeholder')}
                  className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                ></textarea>
              </div>

              {/* Ngày sinh & Giới tính */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                       {t('date_of_birth')}
                   </label>
                   <input
                     type="date"
                     name="dob"
                     value={formData.dob}
                     onChange={handleChange}
                     className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                       {t('gender')}
                   </label>
                   <select
                     name="gender"
                     value={formData.gender}
                     onChange={handleChange}
                     className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 bg-white focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                   >
                     {genderOptions.map(opt => (
                       <option key={opt.value} value={opt.value}>{opt.label}</option>
                     ))}
                   </select>
                </div>
              </div>

              <hr className="border-blueGray-200" />
              
              {/* Liên hệ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                        {t('phone_label')}
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="09xx..."
                        className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">
                        {t('address')}
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Hà Nội, VN..."
                        className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                    />
                  </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end p-6 border-t border-blueGray-200 bg-blueGray-50 rounded-b-lg">
              <button 
                type="button" 
                onClick={onClose} 
                className="text-red-500 font-bold uppercase px-6 py-2 text-sm mr-1 outline-none focus:outline-none hover:bg-red-50 rounded"
              >
                {t('cancel')}
              </button>
              <button 
                type="submit" 
                className="bg-lightBlue-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none transition-all"
              >
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

AboutModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.object
};