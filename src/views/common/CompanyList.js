import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import profileService from "services/profileService";
import CompanyCard from "components/Cards/CompanyCard.js";

export default function CompanyList() {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const data = await profileService.getAllCompanies();
        setCompanies(data || []);
      } catch (error) {
        console.error("Error loading companies:", error);
      } finally {
        // Giả lập delay một chút để hiệu ứng loading trông mượt hơn (tùy chọn)
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-20">
      {/* Header Section */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-4xl font-bold text-blueGray-700 mb-3">
          <i className="fas fa-building text-indigo-500 mr-3"></i>
          {t('companies_title', 'Đối tác Doanh nghiệp')}
        </h2>
        <p className="text-lg text-blueGray-500 max-w-2xl mx-auto">
          {t('companies_subtitle', 'Khám phá những môi trường làm việc chuyên nghiệp và cơ hội thực tập hấp dẫn.')}
        </p>
      </div>

      {/* List Section */}
      <div className="container mx-auto px-4">
        {loading ? (
          // Hiệu ứng Loading đẹp hơn
          <div className="w-full text-center py-32">
            <div className="inline-block animate-bounce bg-indigo-100 p-4 rounded-full mb-4">
              <i className="fas fa-search text-3xl text-indigo-600"></i>
            </div>
            <p className="text-blueGray-500 font-semibold animate-pulse">
              {t('loading', 'Đang tải danh sách doanh nghiệp...')}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap -mx-4">
            {companies.length > 0 ? (
              companies.map((comp) => (
                // Dùng items-stretch để các card trong cùng 1 hàng có chiều cao bằng nhau
                <div 
                  className="w-full md:w-6/12 lg:w-4/12 px-4 mb-8 flex items-stretch" 
                  key={comp.id}
                >
                  <CompanyCard company={comp} />
                </div>
              ))
            ) : (
              // Empty State
              <div className="w-full bg-white rounded-lg shadow-sm border border-blueGray-200 py-20 text-center mx-4">
                <i className="fas fa-folder-open text-6xl text-blueGray-200 mb-4"></i>
                <p className="text-xl font-bold text-blueGray-400">
                  {t('no_companies_found', 'Hiện chưa có dữ liệu công ty.')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}