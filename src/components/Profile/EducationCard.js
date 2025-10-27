// src/components/Profile/EducationCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function EducationCard({ educations }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blueGray-200 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blueGray-700">
          {t('education', 'Education')}
        </h3>
        <button className="text-brand text-sm font-semibold hover:opacity-80 transition-all">
          <i className="fas fa-plus mr-1"></i>
          {t('add', 'Add')}
        </button>
      </div>

      {/* Body */}
      {educations && educations.length > 0 ? (
        <ul className="space-y-4">
          {educations.map((edu) => (
            <li key={edu.id} className="border-b pb-4 last:border-b-0">
              <h4 className="font-bold text-blueGray-700">{edu.schoolName}</h4>
              <p className="text-sm text-blueGray-600">
                {edu.degree} - {edu.major}
              </p>
              <p className="text-xs text-blueGray-500">
                {edu.startDate} - {edu.endDate || t('present', 'Present')}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-blueGray-500 py-6">
          <i className="fas fa-graduation-cap text-4xl mb-3"></i>
          <p>{t('no_education_added', 'No education history added yet')}</p>
        </div>
      )}
    </div>
  );
}

EducationCard.propTypes = {
  educations: PropTypes.array,
};
