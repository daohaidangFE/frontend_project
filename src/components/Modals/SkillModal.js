import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import skillService from 'services/skillService';

// Danh sách Level khớp với Enum Backend (Bạn cần kiểm tra lại file Java Enum để chắc chắn)
const LEVEL_OPTIONS = [
  { value: 'BEGINNER', label: 'Mới bắt đầu (Beginner)' },
  { value: 'INTERMEDIATE', label: 'Trung bình (Intermediate)' },
  { value: 'ADVANCED', label: 'Nâng cao (Advanced)' },
  { value: 'EXPERT', label: 'Chuyên gia (Expert)' }
];

export default function SkillModal({ isOpen, onClose, onSubmit }) {
  const { t } = useTranslation();
  
  // State dữ liệu
  const [categories, setCategories] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  
  // State lựa chọn
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('BEGINNER'); // <--- State mới cho Level
  
  const [loadingCat, setLoadingCat] = useState(false);
  const [loadingSkill, setLoadingSkill] = useState(false);

  // 1. Load danh mục khi mở Modal
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      // Reset state
      setSelectedCategoryId('');
      setSelectedSkillId('');
      setSelectedLevel('BEGINNER'); // Reset level về mặc định
      setSkillsList([]);
    }
  }, [isOpen]);

  // 2. Load danh sách kỹ năng khi chọn danh mục
  useEffect(() => {
    if (selectedCategoryId) {
      loadSkills(selectedCategoryId);
    } else {
      setSkillsList([]);
      setSelectedSkillId('');
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    setLoadingCat(true);
    try {
      const data = await skillService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi load categories:", error);
    } finally {
      setLoadingCat(false);
    }
  };

  const loadSkills = async (categoryId) => {
    setLoadingSkill(true);
    try {
      const data = await skillService.getSkillsByCategory(categoryId);
      setSkillsList(data);
      setSelectedSkillId('');
    } catch (error) {
      console.error("Lỗi load skills:", error);
    } finally {
      setLoadingSkill(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    const skillObj = skillsList.find(s => s.id === selectedSkillId);

    onSubmit({
        skillId: selectedSkillId,
        skillName: skillObj?.name,
        level: selectedLevel // <--- Gửi level người dùng chọn
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black opacity-50" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl">
          
          <div className="flex items-center justify-between p-4 border-b border-blueGray-200">
            <h3 className="text-lg font-bold text-blueGray-700">{t('add_skill', 'Chọn kỹ năng')}</h3>
            <button onClick={onClose} className="text-black opacity-50 text-2xl font-semibold hover:opacity-100">×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
               
               {/* 1. Chọn Danh Mục */}
               <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">{t('category', 'Danh mục')}</label>
                   <select
                     value={selectedCategoryId}
                     onChange={(e) => setSelectedCategoryId(e.target.value)}
                     className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 bg-white focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                     disabled={loadingCat}
                   >
                     <option value="">-- Chọn danh mục --</option>
                     {categories.map((cat) => (
                       <option key={cat.id} value={cat.id}>{cat.name}</option>
                     ))}
                   </select>
               </div>

               {/* 2. Chọn Kỹ Năng */}
               <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">{t('skill', 'Kỹ năng')}</label>
                   <select
                     value={selectedSkillId}
                     onChange={(e) => setSelectedSkillId(e.target.value)}
                     className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 bg-white focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                     disabled={!selectedCategoryId || loadingSkill}
                   >
                     <option value="">-- Chọn kỹ năng --</option>
                     {loadingSkill ? (
                        <option>Đang tải...</option>
                     ) : (
                        skillsList.length > 0 ? (
                            skillsList.map((skill) => (
                                <option key={skill.id} value={skill.id}>{skill.name}</option>
                            ))
                        ) : (
                            selectedCategoryId && <option disabled>Danh mục trống</option>
                        )
                     )}
                   </select>
               </div>

               {/* 3. Chọn Trình Độ (Level) - MỚI THÊM */}
               <div>
                   <label className="block text-xs font-bold mb-2 uppercase text-blueGray-600">{t('level', 'Trình độ')}</label>
                   <select
                     value={selectedLevel}
                     onChange={(e) => setSelectedLevel(e.target.value)}
                     className="w-full px-3 py-3 rounded shadow text-sm border border-blueGray-300 bg-white focus:outline-none focus:ring-1 focus:ring-lightBlue-500"
                   >
                     {LEVEL_OPTIONS.map((opt) => (
                       <option key={opt.value} value={opt.value}>{opt.label}</option>
                     ))}
                   </select>
               </div>

            </div>

            <div className="flex items-center justify-end p-4 border-t border-blueGray-200 bg-blueGray-50 rounded-b-lg">
              <button 
                type="button" 
                onClick={onClose} 
                className="text-red-500 font-bold uppercase px-4 py-2 text-xs mr-2 hover:bg-red-50 rounded transition-all"
              >
                {t('cancel', 'Hủy')}
              </button>
              <button 
                type="submit" 
                className={`text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md transition-all ${!selectedSkillId ? 'bg-blueGray-300 cursor-not-allowed' : 'bg-lightBlue-500 hover:bg-lightBlue-600'}`}
                disabled={!selectedSkillId}
              >
                {t('add', 'Thêm')}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}

SkillModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
};