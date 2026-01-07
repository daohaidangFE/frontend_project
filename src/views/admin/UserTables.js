import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next"; // 1. Import hook

export default function UserTables() {
  const { t } = useTranslation(); // 2. Khởi tạo t
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0 });
  
  // Filter state
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (page = 0) => {
    setLoading(true);
    try {
      const response = await apiClient.get("/auth/v1/admin/users", {
        params: {
          page: page,
          size: 10,
          role: roleFilter || null,
          status: statusFilter || null
        }
      });

      if (response.data.success) {
        setUsers(response.data.data.items);
        setPagination({
          page: response.data.data.page,
          totalPages: response.data.data.totalPages
        });
      }
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      toast.error(t('fetch_users_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, statusFilter]);

  // Mở modal xác nhận
  const handleRequestToggle = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Gọi API đổi trạng thái
  const handleConfirmToggle = async () => {
    if (!selectedUser) return;

    const currentStatus = selectedUser.status;
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";

    try {
      await apiClient.patch(`/auth/v1/admin/users/${selectedUser.id}/status`, { 
        status: newStatus 
      });
      
      fetchUsers(pagination.page);
      
      // Hiển thị thông báo dựa trên trạng thái mới
      if (newStatus === "ACTIVE") {
          toast.success(t('unlock_success', { email: selectedUser.email }));
      } else {
          toast.success(t('lock_success', { email: selectedUser.email }));
      }

    } catch (error) {
      const msg = error.response?.data?.message || t('error');
      toast.error(msg);
    } finally {
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      
      <ToastContainer position="top-right" autoClose={3000} />

      {/* --- MODAL --- */}
      {showModal && selectedUser && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-sm">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-xl font-semibold text-blueGray-700">
                    {t('confirm_action')}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                  </button>
                </div>
                {/* Body */}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                    {t('confirm_lock_user_question')}
                    <span className={`font-bold mx-1 ${selectedUser.status === "ACTIVE" ? "text-red-500" : "text-emerald-500"}`}>
                        {selectedUser.status === "ACTIVE" ? t('lock_action') : t('unlock_action')}
                    </span>
                    {t('account')} <b>{selectedUser.email}</b> ?
                  </p>
                </div>
                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-blueGray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    className={`${
                        selectedUser.status === "ACTIVE" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                    } text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                    type="button"
                    onClick={handleConfirmToggle}
                  >
                    {t('confirm')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}

      {/* Header & Filter */}
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center justify-between">
          <h3 className="font-semibold text-lg text-blueGray-700">
            {t('user_management')}
          </h3>
          <div className="flex gap-2">
            <select 
              className="border rounded px-2 py-1 text-sm outline-none focus:border-lightBlue-500"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">{t('all_roles')}</option>
              <option value="STUDENT">{t('student')}</option>
              <option value="EMPLOYER">{t('employer')}</option>
            </select>
            
            <select 
              className="border rounded px-2 py-1 text-sm outline-none focus:border-lightBlue-500"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">{t('all_statuses')}</option>
              <option value="ACTIVE">{t('active')}</option>
              <option value="BANNED">{t('banned')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                {t('email_label')}
              </th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                {t('role')}
              </th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                {t('profile_status')}
              </th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                {t('action_header')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="4" className="text-center p-4 text-sm text-blueGray-500">{t('loading')}</td></tr>
            ) : users.length === 0 ? (
               <tr><td colSpan="4" className="text-center p-4 text-sm text-blueGray-500">{t('no_users_found')}</td></tr>
            ) : (
              users.map((user) => (
              <tr key={user.id}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-bold text-blueGray-600">
                  {user.email}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <span className={user.role === "EMPLOYER" ? "text-orange-500 font-bold" : "text-lightBlue-500 font-bold"}>
                    {user.role === "EMPLOYER" ? t('employer') : (user.role === "STUDENT" ? t('student') : user.role)}
                  </span>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <i className={`fas fa-circle mr-2 ${
                    user.status === "ACTIVE" ? "text-emerald-500" : "text-red-500"
                  }`}></i> 
                  {user.status === "ACTIVE" ? t('active') : t('banned')}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  {user.role === "SYSTEM_ADMIN" ? (
                    <span className="font-bold text-blueGray-400 italic flex items-center">
                       <i className="fas fa-user-shield mr-2"></i> {t('system_admin')}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRequestToggle(user)}
                      className={`${
                        user.status === "ACTIVE" 
                          ? "bg-red-500 hover:bg-red-600 focus:ring-red-500" 
                          : "bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500"
                      } text-white font-bold uppercase text-xs px-3 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none focus:ring-2 ease-linear transition-all duration-150`}
                    >
                      {user.status === "ACTIVE" ? t('lock') : t('unlock')}
                    </button>
                  )}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="py-3 px-4 flex justify-end items-center border-t border-blueGray-100">
          <button 
            disabled={pagination.page === 0}
            onClick={() => fetchUsers(pagination.page - 1)}
            className="bg-blueGray-200 text-blueGray-600 px-3 py-1 rounded mr-2 text-xs font-bold disabled:opacity-50 hover:bg-blueGray-300 transition-all cursor-pointer"
          >
            {t('prev')}
          </button>
          <span className="text-xs font-semibold text-blueGray-600 mx-2">
             {t('page_info', { page: pagination.page + 1, total: pagination.totalPages || 1 })}
          </span>
          <button 
             disabled={pagination.page >= pagination.totalPages - 1}
             onClick={() => fetchUsers(pagination.page + 1)}
             className="bg-blueGray-200 text-blueGray-600 px-3 py-1 rounded ml-2 text-xs font-bold disabled:opacity-50 hover:bg-blueGray-300 transition-all cursor-pointer"
          >
            {t('next')}
          </button>
      </div>
    </div>
  );
}