import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function ProfileInfoCard({ profile, onSave, loading }) {
    const { t } = useTranslation();
    // Khởi tạo state cho form, dùng dữ liệu hiện tại từ profile
    const [formData, setFormData] = useState({
        fullName: profile?.fullName || '',
        bio: profile?.bio || '',
        dob: profile?.dob || '',
        gender: profile?.gender || 'MALE',
        address: profile?.address || '',
    });
    const [isEditing, setIsEditing] = useState(false);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý lưu
    const handleSave = () => {
        // Data được gửi khớp với StudentProfileRequest của Backend
        const dataToSave = {
            ...formData,
            userId: profile.userId, // CẦN userId để backend xác định Profile
            dob: formData.dob || null, // Đảm bảo DOB là string YYYY-MM-DD hoặc null
        };
        onSave(dataToSave);
        setIsEditing(false);
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                        {t('profile_basic_info')}
                    </h6>
                    <button
                        className="bg-brand text-white active:bg-brand/90 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        disabled={loading}
                    >
                        {loading ? t('saving') : isEditing ? t('save') : t('edit')}
                    </button>
                </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form>
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                        {t('user_information')}
                    </h6>
                    <div className="flex flex-wrap">
                        {/* Full Name */}
                        <div className="w-full lg:w-6/12 px-4 mb-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    {t('full_name')}
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={!isEditing || loading}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                />
                            </div>
                        </div>
                        {/* Gender */}
                        <div className="w-full lg:w-6/12 px-4 mb-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    {t('gender')}
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    disabled={!isEditing || loading}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                >
                                    <option value="MALE">{t('male')}</option>
                                    <option value="FEMALE">{t('female')}</option>
                                    <option value="OTHER">{t('other')}</option>
                                </select>
                            </div>
                        </div>
                        {/* Date of Birth */}
                        <div className="w-full lg:w-6/12 px-4 mb-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    {t('date_of_birth')}
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    disabled={!isEditing || loading}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                />
                            </div>
                        </div>
                        {/* Address */}
                        <div className="w-full lg:w-6/12 px-4 mb-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    {t('address')}
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing || loading}
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                        {t('about_me')}
                    </h6>
                    <div className="flex flex-wrap">
                        {/* Bio */}
                        <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                    {t('biography')}
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing || loading}
                                    rows="4"
                                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    placeholder={t('bio_placeholder')}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

ProfileInfoCard.propTypes = {
    profile: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};
