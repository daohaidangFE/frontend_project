// src/components/Profile/EducationCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

// Hàm helper format ngày tháng (chỉ lấy Tháng/Năm)
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  } catch {
    return dateString;
  }
};

export default function EducationCard({ 
  educations, 
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
          {t('education', 'Education')}
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
      {educations && educations.length > 0 ? (
        <ul className="space-y-4">
          {educations.map((edu) => (
            <li key={edu.id} className="border-b pb-4 last:border-b-0 relative group">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-blueGray-700 text-lg">
                    {edu.schoolName || edu.school}
                  </h4>
                  <p className="text-blueGray-600 font-medium">
                    {edu.degree} {edu.major ? `- ${edu.major}` : ''}
                  </p>
                  <p className="text-sm text-blueGray-500 mt-1">
                    <i className="far fa-calendar-alt mr-2"></i>
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : t('present', 'Present')}
                  </p>
                  {edu.description && (
                    <p className="text-sm text-blueGray-500 mt-2 whitespace-pre-line">
                      {edu.description}
                    </p>
                  )}
                </div>

                {/* Các nút hành động (Sửa/Xóa) cho từng item - Ẩn khi readOnly */}
                {!readOnly && (
                  <div className="flex gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(edu)}
                      className="text-lightBlue-500 hover:text-lightBlue-700"
                      title={t('edit')}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button 
                      onClick={() => onDelete(edu.id)}
                      className="text-red-500 hover:text-red-700"
                      title={t('delete')}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-blueGray-500 py-6 bg-blueGray-50 rounded">
          <i className="fas fa-graduation-cap text-4xl mb-3 text-blueGray-300"></i>
          <p>{t('no_education_added', 'No education history added yet')}</p>
        </div>
      )}
    </div>
  );
}

EducationCard.propTypes = {
  educations: PropTypes.array,
  readOnly: PropTypes.bool,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};