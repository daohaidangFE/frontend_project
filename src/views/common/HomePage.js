import React from "react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
    const { t } = useTranslation();

    return (
    <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold">{t("welcome_message")}</h1>
        <p className="mt-4">{t("homepage_subtitle")}</p>
    </div>
    );
}