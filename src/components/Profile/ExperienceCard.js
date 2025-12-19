// src/components/Profile/ExperienceCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const formatDate = (dateString, t) => {
  if (!dateString) return t('present', 'Hiện tại');
  try {
    // Format hiển thị: 05/2023
    return new Date(dateString).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
  } catch {
    return dateString;
  }
};

export default function ExperienceCard({ 
  experiences, 
  onAddClick, 
  onEditClick, 
  onDeleteClick, 
  readOnly = false 
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blueGray-200 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blueGray-700">
          {t('experience', 'Kinh nghiệm làm việc')}
        </h3>
        
        {/* Chỉ hiện nút Thêm nếu KHÔNG PHẢI readOnly */}
        {!readOnly && (
          <button 
            onClick={onAddClick}
            className="text-brand text-sm font-semibold hover:opacity-80 transition-all flex items-center"
          >
            <i className="fas fa-plus mr-1"></i>
            {t('add', 'Thêm mới')}
          </button>
        )}
      </div>

      {experiences && experiences.length > 0 ? (
        <ul className="space-y-6">
          {experiences.map((exp) => (
            <li 
              key={exp.id} 
              className="border-b border-blueGray-100 pb-4 last:border-b-0 last:pb-0 relative group"
            >
              {/* Nhóm nút Sửa/Xóa - Ẩn khi readOnly */}
              {!readOnly && (
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 bg-white pl-2">
                  <button 
                    onClick={() => onEditClick(exp)}
                    className="text-blueGray-400 hover:text-brand"
                    title={t('edit')}
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button 
                    onClick={() => onDeleteClick(exp.id)}
                    className="text-blueGray-400 hover:text-red-500"
                    title={t('delete')}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              )}

              <h4 className="font-bold text-lg text-blueGray-800">
                {exp.position}
              </h4>

              <p className="text-brand font-semibold text-sm mb-1">
                {exp.companyName}
              </p>

              <p className="text-xs text-blueGray-500 mb-2 flex items-center">
                <i className="far fa-calendar-alt mr-2"></i>
                {formatDate(exp.startDate, t)} - {formatDate(exp.endDate, t)}
              </p>

              {exp.description && (
                <p className="text-sm text-blueGray-600 whitespace-pre-line mt-2">
                  {exp.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-blueGray-400 py-8 bg-blueGray-50 rounded-lg border border-dashed border-blueGray-300">
          <i className="fas fa-briefcase text-3xl mb-3 opacity-50"></i>
          <p className="text-sm">{t('no_experience_added', 'Chưa có thông tin kinh nghiệm')}</p>
        </div>
      )}
    </div>
  );
}

ExperienceCard.propTypes = {
  experiences: PropTypes.array,
  onAddClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  readOnly: PropTypes.bool,
};