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

  // Helper để dịch Level (VD: BEGINNER -> Mới bắt đầu)
  const renderLevel = (level) => {
    if (!level) return "";
    // Giả sử level là "BEGINNER", key sẽ là "level_beginner"
    return t(`level_${level.toLowerCase()}`, level);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blueGray-200 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blueGray-700">
          {t('skills_title')}
        </h3>
        
        {!readOnly && (
          <button 
            onClick={onAdd}
            className="text-lightBlue-500 text-sm font-semibold hover:opacity-80 transition-all focus:outline-none"
          >
            <i className="fas fa-plus mr-1"></i>
            {t('add')}
          </button>
        )}
      </div>

      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <div
              key={skill.id || index}
              onClick={() => !readOnly && onEdit && onEdit(skill)}
              className={`
                relative inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blueGray-200 transition-all
                ${!readOnly 
                  ? 'bg-white text-blueGray-700 cursor-pointer hover:border-lightBlue-500 hover:text-lightBlue-500 pr-8 group' 
                  : 'bg-blueGray-100 text-blueGray-700'
                }
              `}
            >
              <span>{skill.skillName || skill.name}</span>
              
              {skill.level && (
                <span className={`text-xs ml-1 ${!readOnly ? 'text-blueGray-400 group-hover:text-lightBlue-500' : 'text-blueGray-500'}`}>
                  • {renderLevel(skill.level)}
                </span>
              )}

              {!readOnly && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
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
        <div className="text-center text-blueGray-500 py-6 bg-blueGray-50 rounded">
          <i className="fas fa-tools text-4xl mb-3 text-blueGray-300"></i>
          <p>{t('no_skills_added')}</p>
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