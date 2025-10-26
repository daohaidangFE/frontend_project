import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileService from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import ProfileInfoCard from '../../components/Profile/ProfileInfoCard';
import EducationList from '../../components/Profile/EducationList';
import ExperienceList from '../../components/Profile/ExperienceList';
import { useHistory } from 'react-router-dom';

export default function MyProfile() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const history = useHistory();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = user?.userId;

    useEffect(() => {
        if (userId) fetchProfile();
    }, [userId]);

    const formatDate = (dateString) => {
        if (!dateString) return null;
        try {
            if (typeof dateString === 'string') return dateString.substring(0, 10);
            return null;
        } catch {
            return null;
        }
    };

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ProfileService.getStudentProfile(userId);
            const formattedData = {
                ...data,
                dob: formatDate(data.dob),
                educations: data.educations.map(edu => ({
                    ...edu,
                    startDate: formatDate(edu.startDate),
                    endDate: formatDate(edu.endDate),
                })),
                experiences: data.experiences.map(exp => ({
                    ...exp,
                    startDate: formatDate(exp.startDate),
                    endDate: formatDate(exp.endDate),
                })),
            };
            setProfile(formattedData);
        } catch (e) {
            if (e.response?.status === 404) {
                setProfile({
                    userId: user.userId,
                    fullName: user.fullName,
                    educations: [],
                    experiences: [],
                });
                setError(
                    t('profile_not_found_message', 'Your profile is not fully set up. Please fill in the information.')
                );
            } else {
                setError(t('profile_fetch_error', 'Failed to load profile data.'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBasicInfoSave = async (dataToSave) => {
        setLoading(true);
        try {
            await ProfileService.updateBasicProfile(dataToSave);
            await fetchProfile();
            alert(t('profile_updated_success', 'Profile basic information updated successfully!'));
        } catch {
            setError(t('profile_update_error', 'Failed to update profile basic information.'));
        } finally {
            setLoading(false);
        }
    };

    const handleListSave = async (type, userId, listData) => {
        setLoading(true);
        try {
            if (type === 'educations') {
                await ProfileService.replaceEducations(userId, listData);
            } else if (type === 'experiences') {
                await ProfileService.replaceExperiences(userId, listData);
            }
            await fetchProfile();
            alert(t('list_updated_success', { type: t(type) }));
        } catch {
            setError(t('list_update_error', { type: t(type) }));
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-3"></i>
                <p className="text-gray-600 text-lg">{t('loading_profile')}</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
                {t('profile_data_unavailable', 'Profile data is unavailable.')}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold mb-10 text-gray-800 text-center">
                {t('my_profile_title', 'My Student Profile')}
            </h1>

            {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg mb-8 shadow-sm">
                    <strong className="font-semibold">{t('error')}:</strong>
                    <span className="ml-2">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ProfileInfoCard profile={profile} onSave={handleBasicInfoSave} loading={loading} />
                    <EducationList
                        educations={profile.educations}
                        onSave={(userId, list) => handleListSave('educations', userId, list)}
                        loading={loading}
                        userId={userId}
                    />
                    <ExperienceList
                        experiences={profile.experiences}
                        onSave={(userId, list) => handleListSave('experiences', userId, list)}
                        loading={loading}
                        userId={userId}
                    />
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h4 className="text-xl font-semibold mb-4 text-gray-800">{t('profile_overview')}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                            {t('profile_status')}:
                            <span
                                className={`font-semibold ml-2 ${
                                    profile.visible ? 'text-emerald-600' : 'text-red-500'
                                }`}
                            >
                                {profile.visible ? t('visible') : t('hidden')}
                            </span>
                        </p>
                        <p className="text-sm text-gray-600">
                            {t('created_at')}: {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h4 className="text-xl font-semibold mb-4 text-gray-800">{t('cv_upload')}</h4>
                        <p className="text-sm text-gray-600 mb-3">
                            {t('cv_status')}: {profile.cvUrl ? t('uploaded') : t('not_uploaded')}
                        </p>
                        <button className="bg-blue-500 text-white font-medium text-sm px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-150">
                            {t('upload_cv')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
