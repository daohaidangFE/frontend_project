import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import authService from "services/authService";

export default function Settings() {
  const { t } = useTranslation();
  
  const [currentUser, setCurrentUser] = useState(null);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error(t('password_mismatch') || "Mật khẩu xác nhận không khớp");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error(t('password_too_short') || "Mật khẩu phải từ 6 ký tự trở lên");
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword
      });

      toast.success(t('change_password_success') || "Đổi mật khẩu thành công");
      
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || t('error');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="flex flex-wrap">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <div className="relative">
                    <img
                      alt="..."
                      src={currentUser?.avatar || "https://demos.creative-tim.com/notus-react/static/media/team-1-800x800.0efee51b.jpg"}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    />
                  </div>
                </div>
                <div className="w-full px-4 text-center mt-20">
                </div>
              </div>
              <div className="text-center mt-4 mb-6">
                <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700">
                  {currentUser?.fullName || "Administrator"}
                </h3>
                <div className="mb-2 text-blueGray-600 mt-10">
                  <i className="fas fa-envelope mr-2 text-lg text-blueGray-400"></i>
                  {currentUser?.email}
                </div>
                <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-user-shield mr-2 text-lg text-blueGray-400"></i>
                  Role: {currentUser?.role}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-8/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">
                  {t('settings_account') || "Cài đặt tài khoản"}
                </h6>
              </div>
            </div>
            
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleChangePassword}>
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  {t('security') || "Bảo mật"}
                </h6>
                <div className="flex flex-wrap">
                  
                  {/* Current Password */}
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t('current_password') || "Mật khẩu hiện tại"}
                      </label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={passwords.oldPassword}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t('new_password') || "Mật khẩu mới"}
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        {t('confirm_new_password') || "Xác nhận mật khẩu mới"}
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 px-4">
                    <button
                        className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? t('processing') : t('change_password')}
                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}