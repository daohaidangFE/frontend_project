import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const defaultStatsData = [
  { icon: "fa-eye", labelKey: "profile_views", defaultLabel: "Profile Views", value: 124 },
  { icon: "fa-file-alt", labelKey: "applications", defaultLabel: "Applications", value: 8 },
  { icon: "fa-user-friends", labelKey: "connections", defaultLabel: "Connections", value: 23 },
];

export default function StatsCard({ stats }) {
  const { t } = useTranslation();
  const displayStats = stats || defaultStatsData;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-left mt-6 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-lg font-bold text-blueGray-700 mb-4">
        {t('stats', 'Stats')}
      </h3>
      <div className="space-y-3">
        {displayStats.map((stat) => (
          <div key={stat.labelKey} className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <i className={`fas ${stat.icon} text-brand text-base leading-none`}></i>
              <span className="text-blueGray-600">
                {t(stat.labelKey, stat.defaultLabel)}
              </span>
            </div>
            <span className="font-bold text-blueGray-800">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

StatsCard.propTypes = {
  stats: PropTypes.array,
};
