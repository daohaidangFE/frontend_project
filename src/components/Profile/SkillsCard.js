// src/components/Profile/SkillsCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function SkillsCard({ 
  skills, 
  readOnly = false, 
  onAdd, 
  onEdit, 
  onDelete 
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blueGray-200 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blueGray-700">
          {t('skills', 'Skills')}
        </h3>
        
        {/* Chỉ hiện nút Thêm nếu KHÔNG PHẢI readOnly */}
        {!readOnly && (
          <button 
            onClick={onAdd}
            className="text-brand text-sm font-semibold hover:opacity-80 transition-all focus:outline-none"
          >
            <i className="fas fa-plus mr-1"></i>
            {t('add', 'Add')}
          </button>
        )}
      </div>

      {/* Body */}
      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <div
              key={skill.id || index}
              onClick={() => !readOnly && onEdit && onEdit(skill)}
              className={`
                relative inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blueGray-200 transition-all
                ${!readOnly 
                  ? 'bg-white text-blueGray-700 cursor-pointer hover:border-brand hover:text-brand pr-8 group' 
                  : 'bg-blueGray-100 text-blueGray-700'
                }
              `}
            >
              {/* Tên kỹ năng - Hỗ trợ cả skillName (API) và name (Frontend cũ) */}
              <span>{skill.skillName || skill.name}</span>
              
              {/* Level (nếu có) */}
              {skill.level && (
                <span className={`text-xs ml-1 ${!readOnly ? 'text-blueGray-400 group-hover:text-brand' : 'text-blueGray-500'}`}>
                  • {skill.level}
                </span>
              )}

              {/* Nút Xóa (Chỉ hiện khi !readOnly) */}
              {!readOnly && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn sự kiện click vào badge (onEdit)
                    if (onDelete) onDelete(skill.id || skill);
                  }}
                  className="absolute right-2 text-blueGray-400 hover:text-red-500 focus:outline-none opacity-60 hover:opacity-100"
                  title={t('delete')}
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-left text-blueGray-500 py-2">
          <p>{t('no_skills_added', 'No skills added yet')}</p>
        </div>
      )}
    </div>
  );
}

SkillsCard.propTypes = {
  skills: PropTypes.array,
  readOnly: PropTypes.bool,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};