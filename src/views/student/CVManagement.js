import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import cvService from "services/cvService";
import CardCVItem from "components/Cards/CardCVItem";

export default function CVManagement() {
  const { t } = useTranslation();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [editModal, setEditModal] = useState({
    isOpen: false,
    id: null,
    newName: ""
  });

  const loadCVs = async () => {
    try {
      setLoading(true);
      const data = await cvService.getMyCVs();
      data.sort((a, b) => b.id - a.id);
      setCvs(data);
    } catch (error) {
      toast.error(t("load_cv_error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCVs();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.warning(t("cv_invalid_format"));
      return;
    }

    setUploading(true);
    try {
      await cvService.uploadCV(file);
      toast.success(t("cv_upload_success"));
      loadCVs();
    } catch (error) {
      toast.error(t("cv_upload_failed"));
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handleSetDefault = async (cvId) => {
    try {
      await cvService.setDefaultCV(cvId);
      toast.success(t("set_default_success"));
      loadCVs();
    } catch (error) {
      toast.error(t("error"));
    }
  };

  const openEditModal = (cv) => {
    setEditModal({ isOpen: true, id: cv.id, newName: cv.cvName });
  };

  const handleUpdateName = async (cvId, newName) => {
  try {
      await cvService.updateCvName(cvId, newName);
      toast.success(t("update_success", "Đã đổi tên CV"));
      loadCVs(); // Tải lại để đồng bộ
      return true;
    } catch (error) {
      toast.error(t("update_failed"));
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <i className="fas fa-spinner fa-spin text-4xl text-lightBlue-500"></i>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6 border-b border-blueGray-100">
          <div className="text-center flex justify-between items-center">
            <h6 className="text-blueGray-700 text-xl font-bold">
              {t("manage_cv")}
            </h6>

            <label
              className={`cursor-pointer bg-lightBlue-500 active:bg-lightBlue-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md transition-all duration-150 flex items-center ${
                uploading ? "opacity-50" : ""
              }`}
            >
              <i
                className={
                  uploading
                    ? "fas fa-spinner fa-spin mr-2"
                    : "fas fa-cloud-upload-alt mr-2"
                }
              ></i>
              {uploading ? t("uploading") : t("add_new_cv")}
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                disabled={uploading}
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500 border border-solid border-blueGray-100 border-l-0 border-r-0">
                  {t("cv_name")}
                </th>
                <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500 border border-solid border-blueGray-100 border-l-0 border-r-0">
                  {t("status")}
                </th>
                <th className="px-6 py-3 text-xs uppercase font-semibold text-center bg-blueGray-50 text-blueGray-500 border border-solid border-blueGray-100 border-l-0 border-r-0">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {cvs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-blueGray-500 italic">
                    {t("no_cv_found")}
                  </td>
                </tr>
              ) : (
                cvs.map((cv) => (
                  <CardCVItem
                    key={cv.id}
                    cv={cv}
                    onSetDefault={handleSetDefault}
                    onUpdateName={handleUpdateName}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editModal.isOpen && (
        <div className="justify-center items-center flex fixed inset-0 z-50">
          <div className="relative w-auto my-6 mx-auto max-w-sm">
            <div className="border-0 rounded-lg shadow-lg flex flex-col bg-white min-w-[320px]">
              <div className="p-4 border-b border-blueGray-200">
                <h3 className="text-lg font-semibold text-blueGray-700">
                  {t("edit_cv_name")}
                </h3>
              </div>
              <div className="p-6">
                <input
                  type="text"
                  className="px-3 py-3 text-blueGray-600 rounded text-sm shadow w-full border border-blueGray-200"
                  value={editModal.newName}
                  onChange={(e) =>
                    setEditModal({ ...editModal, newName: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end p-4 border-t border-blueGray-200 gap-2">
                <button
                  className="text-blueGray-500 font-bold uppercase px-4 py-2 text-xs"
                  onClick={() =>
                    setEditModal({ isOpen: false, id: null, newName: "" })
                  }
                >
                  {t("cancel")}
                </button>
                <button
                  className="bg-emerald-500 text-white font-bold uppercase text-xs px-4 py-2 rounded"
                  onClick={handleUpdateName}
                >
                  {t("save")}
                </button>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 bg-black"></div>
        </div>
      )}
    </div>
  );
}
