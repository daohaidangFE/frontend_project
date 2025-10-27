// src/components/Profile/ProfileOverviewCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const formatDate = (dateString, t, locale) => {
  if (!dateString) return t('loading', 'Loading...');
  try {
    const date = new Date(dateString);

    const formatted = date.toLocaleDateString(locale || 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    const days = Math.floor(diff / 86400);
    let relative = '';
    if (days === 0) relative = t('today', 'Today');
    else if (days === 1) relative = t('yesterday', 'Yesterday');
    else if (days < 30) relative = t('days_ago', '{{count}} days ago', { count: days });
    else if (days < 365)
      relative = t('months_ago', '{{count}} months ago', { count: Math.floor(days / 30) });
    else
      relative = t('years_ago', '{{count}} years ago', { count: Math.floor(days / 365) });

    return `${formatted} (${relative})`;
  } catch (e) {
    return dateString;
  }
};

const formatVisibility = (isVisible, t) => {
  return isVisible ? t('visible', 'Visible') : t('hidden', 'Hidden');
};

export default function ProfileOverviewCard({ profile }) {
  const { t, i18n } = useTranslation();

  const statusText = formatVisibility(profile.visible, t);
  const createdText = formatDate(profile.createdAt, t, i18n.language);
  const notUpdatedText = t('not_updated', 'Chưa cập nhật');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
      <h3 className="text-lg font-bold text-blueGray-700 mb-4">
        {t('profile_overview', 'Profile Overview')}
      </h3>
      <div className="space-y-3">
        <div className="text-sm">
          <label className="text-xs text-blueGray-500 uppercase font-bold">
            {t('profile_status', 'Profile Status')}
          </label>
          <p className="text-blueGray-700">{statusText}</p>
        </div>
        <div className="text-sm">
          <label className="text-xs text-blueGray-500 uppercase font-bold">
            {t('created_at', 'Created At')}
          </label>
          <p className="text-blueGray-700">{createdText}</p>
        </div>
        <div className="text-sm">
          <label className="text-xs text-blueGray-500 uppercase font-bold">
            {t('portfolio', 'Portfolio')}
          </label>
          <p className="text-brand truncate">{notUpdatedText}</p>
        </div>
      </div>
    </div>
  );
}

ProfileOverviewCard.propTypes = {
  profile: PropTypes.object.isRequired,
};
