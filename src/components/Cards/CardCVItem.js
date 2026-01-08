import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CardCVItem({ cv, onSetDefault, onUpdateName }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(cv.cvName);

  const handleSave = async () => {
    if (tempName.trim() === "" || tempName === cv.cvName) {
      setIsEditing(false);
      return;
    }
    const success = await onUpdateName(cv.id, tempName);
    if (success) setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(cv.cvName);
    setIsEditing(false);
  };

  return (
    <tr className="hover:bg-blueGray-50 transition-colors">
      <td className="px-6 py-4 text-sm border-b border-blueGray-100 min-w-[250px]">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              className="px-2 py-1 text-sm text-blueGray-600 border border-lightBlue-500 rounded outline-none w-full shadow-inner"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <button onClick={handleSave} className="text-emerald-500 hover:text-emerald-700">
              <i className="fas fa-check"></i>
            </button>
            <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
        ) : (
          <div className="flex items-center group">
            <span className="font-bold text-blueGray-600">{cv.cvName}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 text-blueGray-300 opacity-0 group-hover:opacity-100 hover:text-orange-500 transition-all"
            >
              <i className="fas fa-pen text-xs"></i>
            </button>
          </div>
        )}
      </td>

      <td className="px-6 py-4 text-xs border-b border-blueGray-100">
        {cv.default ? (
          <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full font-bold uppercase text-[10px]">
            {t("default", "Mặc định")}
          </span>
        ) : (
          <button
            onClick={() => onSetDefault(cv.id)}
            className="bg-blueGray-100 text-blueGray-500 hover:bg-emerald-500 hover:text-white px-3 py-1 rounded-full font-bold uppercase text-[10px] transition-all"
          >
            {t("set_default", "Đặt mặc định")}
          </button>
        )}
      </td>

      <td className="px-6 py-4 text-center border-b border-blueGray-100">
        <div className="flex justify-center items-center gap-4">
          <a
            href={cv.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="text-lightBlue-500 hover:text-lightBlue-700"
          >
            <i className="fas fa-eye text-lg"></i>
          </a>
        </div>
      </td>
    </tr>
  );
}
