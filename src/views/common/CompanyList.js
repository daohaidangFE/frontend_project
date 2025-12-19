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
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="bg-blueGray-100 min-h-screen pt-24 pb-10">
      {/* Header Section */}
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-3xl font-bold text-blueGray-700 mb-2">
            {t('companies_title')}
        </h2>
        <p className="text-lg text-blueGray-500">
            {t('companies_subtitle')}
        </p>
      </div>

      {/* List Section */}
      <div className="container mx-auto px-4">
        {loading ? (
            <div className="w-full text-center py-20">
                <i className="fas fa-spinner fa-spin text-4xl text-brand"></i>
                <p className="mt-2 text-blueGray-500">{t('loading')}</p>
            </div>
        ) : (
            <div className="flex flex-wrap">
                {companies.length > 0 ? (
                    companies.map((comp) => (
                        <div className="w-full md:w-6/12 lg:w-4/12 px-4" key={comp.id}>
                            <CompanyCard company={comp} />
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-10 text-blueGray-500">
                        {t('no_companies_found')}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}