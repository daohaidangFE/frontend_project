import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    // Hàm để đổi ngôn ngữ, nhận vào mã ngôn ngữ ('vi' hoặc 'en')
    const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    };

    return (
    <div className="flex items-center text-xs uppercase font-bold text-blueGray-700">
        <button
        // Nút sẽ bị mờ đi nếu ngôn ngữ hiện tại là 'vi'
        className={"p-2 " + (i18n.language === 'vi' ? 'text-lightBlue-500' : 'hover:text-blueGray-500')}
        // Vô hiệu hóa nút nếu đang ở ngôn ngữ đó
        disabled={i18n.language === 'vi'}
        // Gọi hàm đổi ngôn ngữ khi bấm
        onClick={() => changeLanguage('vi')}
        >
        VI
        </button>
        <span className="mx-1">|</span>
        <button
        className={"p-2 " + (i18n.language === 'en' ? 'text-lightBlue-500' : 'hover:text-blueGray-500')}
        disabled={i18n.language === 'en'}
        onClick={() => changeLanguage('en')}
        >
        EN
        </button>
    </div>
    );
}