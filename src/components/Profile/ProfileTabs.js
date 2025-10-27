// src/components/Profile/ProfileTabs.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const TABS = [
  { id: 'overview', labelKey: 'overview', defaultLabel: 'Overview' },
  { id: 'education', labelKey: 'education', defaultLabel: 'Education' },
  { id: 'experience', labelKey: 'experience', defaultLabel: 'Experience' },
  { id: 'skills', labelKey: 'skills', defaultLabel: 'Skills' },
  { id: 'projects', labelKey: 'projects', defaultLabel: 'Projects' },
];

export default function ProfileTabs({ activeTab, onTabClick }) {
  const { t } = useTranslation();

  const getButtonClass = (tabId) => {
    const isActive = activeTab === tabId;
    return `inline-block p-4 rounded-t-lg border-b-2 cursor-pointer focus:outline-none ${
      isActive
        ? 'text-brand border-brand'
        : 'border-transparent hover:text-blueGray-600 hover:border-blueGray-300'
    }`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 border border-blueGray-200">
      <div className="border-b border-blueGray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-blueGray-500 px-4">
          {TABS.map((tab) => (
            <li className="mr-2" key={tab.id}>
              <button
                onClick={() => onTabClick(tab.id)}
                className={getButtonClass(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {t(tab.labelKey, tab.defaultLabel)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ProfileTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabClick: PropTypes.func.isRequired,
};
