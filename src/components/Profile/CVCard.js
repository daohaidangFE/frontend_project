// src/components/Profile/CVCard.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function CVCard({ profile }) {
  const { t } = useTranslation();
  const notUpdatedText = t('not_updated', 'Chưa cập nhật');
  const cvStatus = profile.cvUrl ? t('uploaded', 'Uploaded') : t('not_uploaded', 'Not uploaded');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-bold text-blueGray-700 mb-4">
        {t('cv', 'CV')}
      </h3>

      <div className="space-y-3 mb-4">
        <div className="text-sm space-y-1">
          <label className="text-xs text-blueGray-500 uppercase font-bold">
            {t('cv_status', 'CV Status')}
          </label>
          <p className="text-blueGray-700">{cvStatus}</p>
        </div>

        <div className="text-sm space-y-1">
          <label className="text-xs text-blueGray-500 uppercase font-bold">
            {t('view_cv', 'View CV')}
          </label>
          <p className="text-brand truncate">
            {profile.cvUrl ? (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-2"
              >
                <i className="fas fa-file-alt text-brand"></i>
                {profile.cvUrl.substring(profile.cvUrl.lastIndexOf('/') + 1)}
              </a>
            ) : (
              notUpdatedText
            )}
          </p>
        </div>
      </div>

      <button className="bg-brand text-white w-full py-2 px-4 rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center">
        <i className="fas fa-upload mr-2"></i> {t('upload_cv', 'Upload CV')}
      </button>
    </div>
  );
}

CVCard.propTypes = {
  profile: PropTypes.object.isRequired,
};
