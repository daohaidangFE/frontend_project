// src/components/Navbars/AuthNavbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher.js";

export default function AuthNavbar() {
    const { t } = useTranslation();
    return (
        <nav className="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg">
            <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                    <Link
                        to="/"
                        className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
                    >
                        Internship Hub
                    </Link>
                </div>
                <div className="lg:flex flex-grow items-center lg:bg-opacity-0 lg:shadow-none">
                    <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                        <li className="flex items-center mr-4">
                            <LanguageSwitcher />
                        </li>
                        <li className="flex items-center ml-4">
                            <Link to="/">
                                <button
                                    className="bg-brand text-white active:bg-brand/90 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                                    type="button"
                                >
                                    {t('home_button')}
                                </button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}