import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

export default function ExperienceCard({ 
  experiences, 
  onAdd, 
  onEdit, 
  onDelete,
  readOnly = false 
}) {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return t("present");
    return new Date(dateString).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-blueGray-700">
          {t("experience_title")}
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

      {experiences && experiences.length > 0 ? (
        <div className="space-y-8">
            {experiences.map((exp, index) => (
                <div key={exp.id || index} className="relative pl-8 border-l-2 border-blueGray-200 last:border-0 group">
                    {/* Timeline Dot */}
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-lightBlue-500 border-2 border-white shadow-sm z-10"></div>
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-xl font-semibold text-blueGray-800">{exp.position}</h4>
                            <div className="text-lg text-blueGray-600 font-medium">{exp.companyName}</div>
                            <div className="text-sm text-blueGray-400 mt-1 mb-2 italic">
                                <i className="far fa-calendar-alt mr-1"></i>
                                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : t("present")}
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        {!readOnly && (
                          <div className="flex space-x-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                               <button onClick={() => onEdit(exp)} className="text-blueGray-400 hover:text-lightBlue-500" title={t("edit")}>
                                  <i className="fas fa-pencil-alt"></i>
                               </button>
                               <button onClick={() => onDelete(exp.id)} className="text-blueGray-400 hover:text-red-500" title={t("delete")}>
                                  <i className="fas fa-trash"></i>
                               </button>
                          </div>
                        )}
                    </div>

                    {exp.description && (
                        <div className="mt-2 text-blueGray-600 whitespace-pre-line text-sm leading-relaxed bg-blueGray-50 p-3 rounded border border-blueGray-100">
                            {exp.description}
                        </div>
                    )}
                    {exp.achievement && (
                            <div className="mt-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r text-sm">
                                <div className="flex items-start">
                                    <i className="fas fa-trophy text-emerald-500 mt-1 mr-2 text-base"></i>
                                    <div>
                                        <span className="font-bold text-emerald-700 block uppercase text-xs mb-1">
                                            {t('achievement')}
                                        </span>
                                        <span className="text-blueGray-700">
                                            {exp.achievement}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-blueGray-50 rounded-lg border border-dashed border-blueGray-300">
            <p className="text-blueGray-500 mb-2">{t("no_experience")}</p>
            {!readOnly && (
              <button className="text-lightBlue-500 font-bold text-sm hover:underline" onClick={onAdd}>
                  {t("add_first_experience")}
              </button>
            )}
        </div>
      )}
    </div>
  );
}

ExperienceCard.propTypes = {
  experiences: PropTypes.array,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  readOnly: PropTypes.bool,
};