import React from "react";
import { useTranslation } from "react-i18next";

export default function StatusBadge({ status }) {
    const { t } = useTranslation();

    let color = "bg-blueGray-200 text-blueGray-600";
    let labelKey = "";

    switch(status) {
        case 'ACTIVE':
            color = "bg-emerald-200 text-emerald-600";
            labelKey = "status_active";
            break;
        case 'PENDING':
            color = "bg-orange-200 text-orange-600";
            labelKey = "status_pending";
            break;
        case 'CLOSED':
        case 'EXPIRED':
            color = "bg-red-200 text-red-600";
            labelKey = "status_expired";
            break;
        case 'HIDDEN':
            color = "bg-blueGray-200 text-blueGray-600";
            labelKey = "status_hidden";
            break;
        case 'REJECTED':
            color = "bg-red-200 text-red-600";
            labelKey = "status_rejected";
            break;
        default:
            labelKey = status;
    }

    return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${color} whitespace-nowrap`}>
            {t(labelKey) || status}
        </span>
    );
}