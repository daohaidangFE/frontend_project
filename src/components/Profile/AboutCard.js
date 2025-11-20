// src/components/Profile/AboutCard.js
import React, { useState, useEffect } from "react";
import profileService from "services/profileService";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const formatGender = (gender, t) => {
  if (!gender) return t("not_updated", "Chưa cập nhật");
  const normalized = gender.toLowerCase();
  if (normalized === "male") return "Nam";
  if (normalized === "female") return "Nữ";
  return t(normalized, gender);
};

const formatDate = (dateString, t) => {
  if (!dateString) return t("not_updated", "Chưa cập nhật");
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

export default function AboutCard({ profile, isEditing, onEditToggle, onSaveSuccess }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    setFormData(profile);
  }, [profile, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    onEditToggle();
    setSaveError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedProfile = await profileService.updateBasicProfile(formData);
      onSaveSuccess(savedProfile);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blueGray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blueGray-700">
          {t("about", "About")}
        </h3>

        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="text-sm text-blueGray-600 font-semibold hover:opacity-80 transition-all"
            >
              {t("cancel", "Cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="text-brand text-sm font-semibold hover:opacity-80 transition-all"
            >
              {isSaving ? (
                <i className="fas fa-spinner fa-spin mr-1"></i>
              ) : (
                <i className="fas fa-save mr-1"></i>
              )}
              {t("save", "Save")}
            </button>
          </div>
        ) : (
          <button
            onClick={onEditToggle}
            className="text-brand text-sm font-semibold hover:opacity-80 transition-all"
          >
            <i className="fas fa-pen mr-1"></i>
            {t("edit", "Edit")}
          </button>
        )}
      </div>

      {saveError && (
        <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-2 mb-4 text-sm">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
            {t("full_name", "Full name")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              className="text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          ) : (
            <p className="text-blueGray-700">
              {profile.fullName || t("not_updated", "Chưa cập nhật")}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
            {t("gender", "Gender")}
          </label>
          {isEditing ? (
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            >
              <option value="">{t('select', 'Select...')}</option>
              <option value="MALE">{t('male', 'Nam')}</option>
              <option value="FEMALE">{t('female', 'Nữ')}</option>
            </select>
          ) : (
            <p className="text-blueGray-700">{formatGender(profile.gender, t)}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
            {t("date_of_birth", "Date of Birth")}
          </label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={formData.dob ? formData.dob.split('T')[0] : ''}
              onChange={handleChange}
              className="text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          ) : (
            <p className="text-blueGray-700">{formatDate(profile.dob, t)}</p>
          )}
        </div>

        <div>
          <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
            {t("address", "Address")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          ) : (
            <p className="text-blueGray-700">
              {profile.address || t("not_updated", "Chưa cập nhật")}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
            {t("bio", "Bio")}
          </label>
          {isEditing ? (
            <textarea
              name="bio"
              rows="3"
              value={formData.bio || ''}
              onChange={handleChange}
              className="text-sm placeholder-slate-400 pl-3 pr-3 rounded-lg border border-slate-300 w-full py-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          ) : (
            <p className="text-blueGray-700 whitespace-pre-line">
              {profile.bio || t("not_updated", "Chưa cập nhật")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

AboutCard.propTypes = {
  profile: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEditToggle: PropTypes.func.isRequired,
  onSaveSuccess: PropTypes.func.isRequired,
};
