import React, { useState, useEffect } from "react";
import skillService from "../../services/skillService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next"; // 1. Import hook

export default function SkillManagement() {
  const { t } = useTranslation(); // 2. Khởi tạo t
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("categories"); // 'categories' | 'skills'
  const [loading, setLoading] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);

  // State cho Modal (Thêm/Sửa)
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "" // Chỉ dùng khi tạo Skill
  });

  // Filter cho Skill (Lọc theo danh mục)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  // --- EFFECT ---
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "skills") {
      fetchSkills();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedCategoryFilter]);

  // --- API CALLS ---
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await skillService.getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error(t('error_loading'));
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedCategoryFilter) {
        data = await skillService.getSkillsByCategory(selectedCategoryFilter);
      } else {
        // Nếu không chọn danh mục -> Tìm tất cả (truyền rỗng)
        data = await skillService.searchSkills("");
      }
      setSkills(data);
    } catch (error) {
      toast.error(t('error_loading'));
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleOpenModal = (item = null) => {
    setIsEditing(!!item);
    setCurrentItem(item);
    
    if (item) {
      // Đổ dữ liệu vào form để sửa
      setFormData({
        name: item.name,
        description: item.description || "",
        categoryId: item.category ? item.category.id : "" 
      });
    } else {
      // Reset form để thêm mới
      setFormData({
        name: "",
        description: "",
        categoryId: categories.length > 0 ? categories[0].id : ""
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete_text'))) return;

    try {
      if (activeTab === "categories") {
        await skillService.deleteCategory(id);
        fetchCategories();
      } else {
        await skillService.deleteSkill(id);
        fetchSkills();
      }
      toast.success(t('delete_success'));
    } catch (error) {
      // Backend có check lỗi CATEGORY_HAS_SKILLS, hiển thị thông báo đó
      const msg = error.response?.data?.message || t('operation_failed');
      toast.error(msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "categories") {
        const payload = { 
            name: formData.name, 
            description: formData.description 
        };
        if (isEditing) {
          await skillService.updateCategory(currentItem.id, payload);
          toast.success(t('update_category_success'));
        } else {
          await skillService.createCategory(payload);
          toast.success(t('create_category_success'));
        }
        fetchCategories();
      } else {
        // Tab Skills
        const payload = {
            name: formData.name,
            description: formData.description,
            categoryId: formData.categoryId
        };
        if (isEditing) {
          await skillService.updateSkill(currentItem.id, payload);
          toast.success(t('update_skill_success'));
        } else {
          await skillService.createSkill(payload);
          toast.success(t('create_skill_success'));
        }
        fetchSkills();
      }
      setShowModal(false);
    } catch (error) {
      const msg = error.response?.data?.message || t('operation_failed');
      toast.error(msg);
    }
  };

  // --- RENDER ---
  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* HEADER & TABS */}
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center justify-between">
          <h3 className="font-semibold text-lg text-blueGray-700">
            {t('system_skill_management')}
          </h3>
          
          <div className="flex space-x-2">
             {/* Tab Buttons */}
             <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 rounded text-sm font-bold uppercase shadow outline-none focus:outline-none ease-linear transition-all duration-150 ${
                activeTab === "categories" ? "bg-lightBlue-500 text-white" : "bg-blueGray-200 text-blueGray-600"
              }`}
            >
              {t('category')}
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-4 py-2 rounded text-sm font-bold uppercase shadow outline-none focus:outline-none ease-linear transition-all duration-150 ${
                activeTab === "skills" ? "bg-lightBlue-500 text-white" : "bg-blueGray-200 text-blueGray-600"
              }`}
            >
              {t('skill')}
            </button>
          </div>
        </div>
      </div>

      {/* TOOLBAR & FILTER */}
      <div className="px-4 py-3 flex justify-between items-center bg-blueGray-50 border-t border-blueGray-100">
          <div className="flex-1">
             {/* Chỉ hiện filter khi ở tab Skills */}
             {activeTab === "skills" && (
                <select 
                    className="border rounded px-3 py-2 text-sm outline-none w-64 focus:border-lightBlue-500"
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                >
                    <option value="">{t('all_categories')}</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
             )}
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            <i className="fas fa-plus mr-2"></i> 
            {t('add')} {activeTab === "categories" ? t('category') : t('skill')}
          </button>
      </div>

      {/* MAIN TABLE CONTENT */}
      <div className="block w-full overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead>
            <tr>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                {t('name_label')}
              </th>
              {activeTab === "skills" && (
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    {t('belongs_to_category')}
                </th>
              )}
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                {t('description')}
              </th>
              <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                {t('action_header')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
                <tr><td colSpan="4" className="text-center p-4">{t('loading')}</td></tr>
            )}
            
            {!loading && activeTab === "categories" && categories.map(item => (
                <tr key={item.id}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-bold text-blueGray-700">
                        {item.name}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4">
                        {item.description}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                        <button onClick={() => handleOpenModal(item)} className="text-lightBlue-500 font-bold mr-4 hover:underline">{t('edit')}</button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 font-bold hover:underline">{t('delete')}</button>
                    </td>
                </tr>
            ))}

            {!loading && activeTab === "skills" && skills.map(item => (
                <tr key={item.id}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-bold text-blueGray-700">
                        {item.name}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                            {item.category?.name}
                        </span>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4">
                        {item.description}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                        <button onClick={() => handleOpenModal(item)} className="text-lightBlue-500 font-bold mr-4 hover:underline">{t('edit')}</button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 font-bold hover:underline">{t('delete')}</button>
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-full my-6 mx-auto max-w-lg">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h3 className="text-xl font-semibold">
                                {isEditing ? t('update') : t('add_new')} {activeTab === "categories" ? t('category') : t('skill')}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-black opacity-50 text-2xl font-semibold">×</button>
                        </div>
                        
                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t('name_label')}</label>
                                <input 
                                    type="text" 
                                    className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            {/* Chỉ hiện chọn Category khi ở tab Skills */}
                            {activeTab === "skills" && (
                                <div className="mb-4">
                                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t('category')}</label>
                                    <select 
                                        className="border px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                        required
                                    >
                                        <option value="">{t('select_category')}</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">{t('description')}</label>
                                <textarea 
                                    className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="flex justify-end pt-4 border-t border-solid border-blueGray-200 rounded-b">
                                <button
                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                >
                                    {t('close')}
                                </button>
                                <button
                                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="submit"
                                >
                                    {t('save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}

    </div>
  );
}