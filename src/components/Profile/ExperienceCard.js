// src/components/Profile/ExperienceCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function ExperienceCard({ experiences }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blueGray-200 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blueGray-700">
          {t('experience', 'Experience')}
        </h3>
        <button className="text-brand text-sm font-semibold hover:opacity-80 transition-all">
          <i className="fas fa-plus mr-1"></i>
          {t('add', 'Add')}
        </button>
      </div>

      {/* Body */}
      {experiences && experiences.length > 0 ? (
        <ul className="space-y-4">
          {experiences.map((exp) => (
            <li key={exp.id} className="border-b pb-4 last:border-b-0">
              <h4 className="font-bold text-blueGray-700">
                {exp.role} {exp.companyName && `at ${exp.companyName}`}
              </h4>
              {exp.projectName && (
                <p className="text-sm text-blueGray-600">
                  Project: {exp.projectName}
                </p>
              )}
              <p className="text-xs text-blueGray-500">
                {exp.startDate} - {exp.endDate || t('present', 'Present')}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-blueGray-500 py-6">
          <i className="fas fa-briefcase text-4xl mb-3"></i>
          <p>{t('no_experience_added', 'No experience added yet')}</p>
        </div>
      )}
    </div>
  );
}

ExperienceCard.propTypes = {
  experiences: PropTypes.array,
};
