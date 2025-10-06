import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "components/LanguageSwitcher/LanguageSwitcher.js";

export default function MainNavbar() {
    const { t } = useTranslation();


    const [navbarOpen, setNavbarOpen] = React.useState(false);
    return (
    <>
        <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
            <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            {/* Brand/Logo */}
            <Link
                to="/"
                className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            >
                Internship Hub
            </Link>
            {/* Mobile Menu Toggler */}
            <button
                className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                type="button"
                onClick={() => setNavbarOpen(!navbarOpen)}
            >
                <i className="fas fa-bars"></i>
            </button>
            </div>
            <div
            className={
                "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
                (navbarOpen ? " block" : " hidden")
            }
            >
            {/* Navigation Links (Left side) */}
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                <li className="flex items-center">
                <Link
                    to="/jobs"
                    className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                >
                    <i className="fas fa-briefcase text-lg leading-lg mr-2" />{" "}
                    {t('find_internship')}
                </Link>
                </li>
                <li className="flex items-center">
                <Link
                    to="/companies"
                    className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                >
                    <i className="fas fa-building text-lg leading-lg mr-2" />{" "}
                    {t('companies')}
                </Link>
                </li>
                {/* Auth Buttons (Right side) */}
                <li className="flex items-center ml-4">
                <Link to="/auth/login">
                    <button
                    className="bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    type="button"
                    >
                        {t('login_button')}
                    </button>
                </Link>
                </li>
                <li className="flex items-center">
                <Link to="/auth/register">
                    <button
                    className="border border-lightBlue-500 text-lightBlue-500 active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    type="button"
                    >
                        {t('register_button')}
                    </button>
                </Link>
                </li>
                <li className="flex items-center">
                    <LanguageSwitcher />
                </li>
            </ul>
            </div>
        </div>
        </nav>
    </>
    );
}