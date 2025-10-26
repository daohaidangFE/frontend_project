import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid'; // Giả định có thư viện uuid

const initialEducationState = {
    id: '', // Dùng UUID, nếu là item mới thì là chuỗi rỗng hoặc UUID tạm
    schoolName: '',
    major: '',
    degree: 'BACHELOR', // Default value
    startDate: '',
    endDate: '',
    description: '',
};

export default function EducationList({ educations, onSave, loading, userId }) {
    const { t } = useTranslation();
    const [list, setList] = useState(educations || []);
    const [editingIndex, setEditingIndex] = useState(null);
    const [currentEdit, setCurrentEdit] = useState(initialEducationState);

    // Cập nhật trường đang chỉnh sửa
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentEdit(prev => ({ ...prev, [name]: value }));
    };

    // Bắt đầu chỉnh sửa/thêm mới
    const startEditing = (edu, index) => {
        const safeEdu = { 
            ...edu, 
            startDate: edu.startDate ? String(edu.startDate) : '',
            endDate: edu.endDate ? String(edu.endDate) : '',
            id: edu.id || uuidv4(), // Nếu là item mới thì gán UUID tạm
        };
        setCurrentEdit(safeEdu);
        setEditingIndex(index);
    };

    // Lưu item đang chỉnh sửa/thêm mới
    const saveItem = () => {
        const { id, ...data } = currentEdit;
        // Dữ liệu gửi đi khớp với EducationDTO của Backend
        const newEdu = { 
            ...data, 
            startDate: data.startDate || null,
            endDate: data.endDate || null,
            // Giữ lại ID nếu đang sửa, nếu là item mới thì bỏ qua ID tạm
            ...(editingIndex !== null ? { id: list[editingIndex]?.id || id } : {}) 
        };

        let updatedList;
        if (editingIndex !== null) {
            // Sửa
            updatedList = list.map((item, i) => i === editingIndex ? newEdu : item);
        } else {
            // Thêm mới
            updatedList = [...list, newEdu];
        }

        setList(updatedList);
        onSave(userId, updatedList); // Gọi hàm lưu API
        setEditingIndex(null);
        setCurrentEdit(initialEducationState);
    };

    // Xóa item
    const removeItem = (index) => {
        const updatedList = list.filter((_, i) => i !== index);
        setList(updatedList);
        onSave(userId, updatedList); // Gọi hàm lưu API
    };
    
    // Nút hủy
    const cancelEdit = () => {
        setEditingIndex(null);
        setCurrentEdit(initialEducationState);
    };

    const DegreeOptions = ['HIGH_SCHOOL', 'COLLEGE', 'BACHELOR', 'MASTER', 'PHD'];

    // Form Modal (sử dụng như một modal/inline form)
    const renderForm = () => (
        <div className="p-4 bg-blueGray-50 rounded-lg mb-4">
            <h5 className="text-md font-semibold mb-3">{editingIndex !== null ? t('edit_education') : t('add_education')}</h5>
            <div className="flex flex-wrap -mx-2">
                {/* School Name */}
                <div className="w-full md:w-6/12 px-2 mb-3">
                    <label className="block text-blueGray-600 text-xs font-bold mb-1">{t('school_name')}</label>
                    <input type="text" name="schoolName" value={currentEdit.schoolName} onChange={handleEditChange} required
                        className="border px-3 py-2 w-full rounded text-sm focus:ring focus:ring-brand focus:border-brand" />
                </div>
                {/* Major */}
                <div className="w-full md:w-6/12 px-2 mb-3">
                    <label className="block text-blueGray-600 text-xs font-bold mb-1">{t('major')}</label>
                    <input type="text" name="major" value={currentEdit.major} onChange={handleEditChange}
                        className="border px-3 py-2 w-full rounded text-sm focus:ring focus:ring-brand focus:border-brand" />
                </div>
                {/* Degree */}
                <div className="w-full md:w-6/12 px-2 mb-3">
                    <label className="block text-blueGray-600 text-xs font-bold mb-1">{t('degree')}</label>
                    <select name="degree" value={currentEdit.degree} onChange={handleEditChange}
                        className="border px-3 py-2 w-full rounded text-sm focus:ring focus:ring-brand focus:border-brand">
                        {DegreeOptions.map(deg => (
                            <option key={deg} value={deg}>{t(deg.toLowerCase())}</option>
                        ))}
                    </select>
                </div>
                {/* Start/End Date */}
                <div className="w-full md:w-6/12 px-2 flex">
                    <div className="w-1/2 pr-1 mb-3">
                        <label className="block text-blueGray-600 text-xs font-bold mb-1">{t('start_date')}</label>
                        <input type="date" name="startDate" value={currentEdit.startDate} onChange={handleEditChange}
                            className="border px-3 py-2 w-full rounded text-sm focus:ring focus:ring-brand focus:border-brand" />
                    </div>
                    <div className="w-1/2 pl-1 mb-3">
                        <label className="block text-blueGray-600 text-xs font-bold mb-1">{t('end_date')}</label>
                        <input type="date" name="endDate" value={currentEdit.endDate} onChange={handleEditChange}
                            className="border px-3 py-2 w-full rounded text-sm focus:ring focus:ring-brand focus:border-brand" />
                    </div>
                </div>
                {/* Description */}
                <div className="w-full px-2 mb-3">
                    <label className="block text-blueGray-600 text-xs font-bold mb-1">{t('description')}</label>
                    <textarea name="description" value={currentEdit.description} onChange={handleEditChange} rows="2"
                        className="border px-3 py-2 w-full rounded text-sm focus:ring focus:ring-brand focus:border-brand" />
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <button type="button" onClick={cancelEdit}
                    className="text-blueGray-600 bg-white hover:bg-blueGray-100 font-bold uppercase text-xs px-4 py-2 rounded shadow transition-all duration-150 mr-2">
                    {t('cancel')}
                </button>
                <button type="button" onClick={saveItem} disabled={loading}
                    className="bg-brand text-white active:bg-brand/90 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md transition-all duration-150">
                    {t('save')}
                </button>
            </div>
        </div>
    );

    // List View
    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-4">
                <div className="flex justify-between items-center">
                    <h6 className="text-blueGray-700 text-xl font-bold">{t('education_history')}</h6>
                    <button
                        className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => startEditing(initialEducationState, null)}
                        disabled={loading || editingIndex !== null}
                    >
                        <i className="fas fa-plus mr-1"></i> {t('add_new')}
                    </button>
                </div>
            </div>
            
            <div className="flex-auto px-4 lg:px-10 py-4 pt-0">
                {editingIndex === null && currentEdit.id !== '' && renderForm()}
                {editingIndex === null ? (
                    list.length === 0 ? (
                        <p className="text-blueGray-500 text-center py-4">{t('no_education_info')}</p>
                    ) : (
                        <div className="space-y-4 pt-4">
                            {list.map((edu, index) => (
                                <div key={edu.id || index} className="border p-4 rounded-lg flex justify-between items-start hover:shadow-sm transition-shadow">
                                    <div className="w-11/12">
                                        <h4 className="text-base font-semibold text-brand">{edu.schoolName}</h4>
                                        <p className="text-sm text-blueGray-700">{edu.major} ({t(edu.degree.toLowerCase())})</p>
                                        <p className="text-xs text-blueGray-500">
                                            {edu.startDate} - {edu.endDate || t('present')}
                                        </p>
                                        {edu.description && <p className="text-blueGray-600 text-sm mt-1">{edu.description}</p>}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-blueGray-600 hover:text-brand" onClick={() => startEditing(edu, index)} disabled={loading}>
                                            <i className="fas fa-edit text-sm"></i>
                                        </button>
                                        <button className="text-red-500 hover:text-red-700" onClick={() => removeItem(index)} disabled={loading}>
                                            <i className="fas fa-trash-alt text-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    // Hiển thị form chỉnh sửa khi editingIndex != null
                    renderForm()
                )}
            </div>
        </div>
    );
}

EducationList.propTypes = {
    educations: PropTypes.arrayOf(PropTypes.object),
    onSave: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    userId: PropTypes.string.isRequired,
};
