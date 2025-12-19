import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    // return (
    //     <div className="fixed top-4 z-50 bg-white shadow-md rounded-full flex items-center text-xs uppercase font-bold text-blueGray-700 border border-slate-200">
    //         <button
    //             className={"p-2 rounded-l-full " + (i18n.language === 'vi' ? 'text-brand' : 'hover:text-blueGray-500')}
    //             disabled={i18n.language === 'vi'}
    //             onClick={() => changeLanguage('vi')}
    //         >
    //             VI
    //         </button>
    //         <span className="text-slate-300">|</span>
    //         <button
    //             className={"p-2 rounded-r-full " + (i18n.language === 'en' ? 'text-brand' : 'hover:text-blueGray-500')}
    //             disabled={i18n.language === 'en'}
    //             onClick={() => changeLanguage('en')}
    //         >
    //             EN
    //         </button>
    //     </div>
    // );
    return null;
}