import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import defaultAvatar from 'assets/img/team-1-800x800.jpg';

// Helper định dạng ngày
const formatDate = (dateString, t) => {
  if (!dateString) return t('loading');
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export default function ProfileInfoCard({ profile }) {
  const { t } = useTranslation();

  const joinedDate = formatDate(profile.createdAt, t);
  const notUpdatedText = t('not_updated');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center border border-blueGray-200">
      {/* Avatar */}
      <div className="relative mx-auto w-32 h-32 mb-4">
        <img
            src={profile.avatarUrl || defaultAvatar}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-blueGray-100 shadow-sm"
        />
      </div>

      {/* Name */}
      <h2 className="text-xl font-bold text-blueGray-800">
        {profile.fullName || t('unknown_user')}
      </h2>

      {/* Title */}
      <p className="text-sm text-blueGray-500 mb-4 font-medium uppercase tracking-wide">
        {t('internship_candidate')}
      </p>

      {/* Location */}
      <div className="flex items-center justify-center text-sm text-blueGray-500 mb-2">
        <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
        <span>{profile.address || notUpdatedText}</span>
      </div>

      {/* Joined Date */}
      <div className="flex items-center justify-center text-sm text-blueGray-500 mb-4">
        <i className="fas fa-calendar-alt mr-2 text-lightBlue-500"></i>
        <span>{t('joined')} {joinedDate}</span>
      </div>
    </div>
  );
}

ProfileInfoCard.propTypes = {
  profile: PropTypes.object.isRequired,
};