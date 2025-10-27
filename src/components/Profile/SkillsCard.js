// src/components/Profile/SkillsCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function SkillsCard({ skills }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blueGray-200 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blueGray-700">
          {t('skills', 'Skills')}
        </h3>
        <button className="text-brand text-sm font-semibold hover:opacity-80 transition-all">
          <i className="fas fa-plus mr-1"></i>
          {t('add', 'Add')}
        </button>
      </div>

      {/* Body */}
      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className="bg-blueGray-100 text-blueGray-700 px-3 py-1 rounded-full text-sm font-medium border border-blueGray-200"
            >
              {skill.name}
              {skill.level && (
                <span className="text-blueGray-500 text-xs ml-1">
                  ({t('level', 'Level')}: {skill.level})
                </span>
              )}
            </span>
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
};
