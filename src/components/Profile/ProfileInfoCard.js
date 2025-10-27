// src/components/Profile/ProfileInfoCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import defaultAvatar from 'assets/img/team-1-800x800.jpg';

// Helper định dạng ngày
const formatDate = (dateString, t) => {
  if (!dateString) return t('loading', 'Loading...');
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
  const notUpdatedText = t('not_updated', 'Chưa cập nhật');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center mt-6">
      {/* Avatar */}
      <img
        src={profile.avatarUrl || defaultAvatar}
        alt="Profile"
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blueGray-100"
      />

      {/* Name */}
      <h2 className="text-xl font-bold text-blueGray-800">
        {profile.fullName || t('unknown_user', 'Unknown User')}
      </h2>

      {/* Title */}
      <p className="text-sm text-blueGray-500 mb-4">
        {t('internship_candidate', 'Internship Candidate')}
      </p>

      {/* Location */}
      <div className="flex items-center justify-center text-sm text-blueGray-500 mb-2">
        <i className="fas fa-map-marker-alt mr-2"></i>
        <span>{profile.address || notUpdatedText}</span>
      </div>

      {/* Joined Date */}
      <div className="flex items-center justify-center text-sm text-blueGray-500 mb-4">
        <i className="fas fa-calendar-alt mr-2"></i>
        <span>{t('joined', 'Joined')} {joinedDate}</span>
      </div>

      {/* Edit Button */}
      <Link to="/student/profile/edit" className="block w-full">
        <button className="bg-brand text-white w-full py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center">
          <i className="fas fa-user-edit mr-2"></i> {t('edit_profile', 'Edit Profile')}
        </button>
      </Link>
    </div>
  );
}

ProfileInfoCard.propTypes = {
  profile: PropTypes.object.isRequired,
};
