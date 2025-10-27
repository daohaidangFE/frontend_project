// src/components/Profile/AboutCard.js
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// ✅ Chuẩn hóa mapping giới tính
const GENDER_MAP = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

const formatGender = (gender, t) => {
  if (!gender) return t("not_updated", "Chưa cập nhật");
  const normalized = gender.toLowerCase();
  return GENDER_MAP[normalized] || t(normalized, gender);
};

// ✅ Format ngày sinh theo locale Việt Nam
const formatDate = (dateString, t) => {
  if (!dateString) return t("not_updated", "Chưa cập nhật");
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export default function AboutCard({ profile }) {
  const { t } = useTranslation();
  const genderText = formatGender(profile.gender, t);
  const dobText = formatDate(profile.dob, t);
  const notUpdatedText = t("not_updated", "Chưa cập nhật");

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blueGray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blueGray-700">
          {t("about", "About")}
        </h3>
        <Link
          to="/student/profile/edit"
          className="text-brand text-sm font-semibold hover:opacity-80 transition-all"
        >
          <i className="fas fa-pen mr-1"></i>
          {t("edit", "Edit")}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
            {t("full_name", "Full name")}
          </label>
          <p className="text-blueGray-700">
            {profile.fullName || notUpdatedText}
          </p>
        </div>

        <div>
          <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
            {t("gender", "Gender")}
          </label>
          <p className="text-blueGray-700">{genderText}</p>
        </div>

        <div>
          <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
            {t("date_of_birth", "Date of Birth")}
          </label>
          <p className="text-blueGray-700">{dobText}</p>
        </div>

        <div>
          <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
            {t("address", "Address")}
          </label>
          <p className="text-blueGray-700">
            {profile.address || notUpdatedText}
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs text-blueGray-500 uppercase font-bold block mb-1">
            {t("bio", "Bio")}
          </label>
          <p className="text-blueGray-700 whitespace-pre-line">
            {profile.bio || notUpdatedText}
          </p>
        </div>
      </div>
    </div>
  );
}

AboutCard.propTypes = {
  profile: PropTypes.object.isRequired,
};
