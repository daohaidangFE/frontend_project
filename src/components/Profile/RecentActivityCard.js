// src/components/Profile/RecentActivityCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const placeholderActivities = [
  {
    id: 1,
    icon: 'fas fa-file-alt',
    iconBgColor: 'bg-indigo-100',
    iconTextColor: 'text-indigo-600',
    text: (t) => (
      <>
        {t('applied_for', 'Applied for')}{' '}
        <span className="font-semibold text-blueGray-800">Frontend Developer Intern</span>{' '}
        {t('at', 'at')}{' '}
        <span className="font-semibold text-blueGray-800">TechCorp</span>
      </>
    ),
    time: '2 days ago',
    timeKey: 'time_days_ago',
    timeArgs: { count: 2 },
  },
  {
    id: 2,
    icon: 'fas fa-user-friends',
    iconBgColor: 'bg-pink-100',
    iconTextColor: 'text-pink-600',
    text: (t) => (
      <>
        {t('connected_with', 'Connected with')}{' '}
        <span className="font-semibold text-blueGray-800">Sarah Johnson</span>{' '}
        {t('from', 'from')}{' '}
        <span className="font-semibold text-blueGray-800">DesignHub</span>
      </>
    ),
    time: '1 week ago',
    timeKey: 'time_weeks_ago',
    timeArgs: { count: 1 },
  },
];

export default function RecentActivityCard() {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blueGray-200">
      <h3 className="text-xl font-bold text-blueGray-700 mb-4">
        {t('recent_activity', 'Recent Activity')}
      </h3>

      <ul className="space-y-4">
        {placeholderActivities.map((activity, index) => (
          <li
            key={activity.id}
            className={`flex items-center space-x-3 pb-4 ${
              index < placeholderActivities.length - 1 ? 'border-b border-blueGray-200' : ''
            }`}
          >
            <div
              className={`p-2 rounded-full h-10 w-10 flex items-center justify-center ${activity.iconBgColor} ${activity.iconTextColor}`}
            >
              <i className={activity.icon}></i>
            </div>
            <div>
              <p className="text-sm text-blueGray-700">
                {activity.text(t)}
              </p>
              <p className="text-xs text-blueGray-500">
                {t(activity.timeKey || 'time_fallback', activity.time, activity.timeArgs)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
