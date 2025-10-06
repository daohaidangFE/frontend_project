import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
    .use(initReactI18next) // Kết nối i18next với react-i18next
    .use(LanguageDetector) // Tự động phát hiện ngôn ngữ của trình duyệt
    .use(HttpApi) // Dùng để tải các file json từ thư mục public
    .init({
    // Các ngôn ngữ mà dự án hỗ trợ
    supportedLngs: ["en", "vi"],

    // Ngôn ngữ mặc định nếu không phát hiện được ngôn ngữ của trình duyệt
    fallbackLng: "vi",

    // Cấu hình cho việc phát hiện ngôn ngữ
    detection: {
        // Thứ tự ưu tiên phát hiện: tìm trong cookie trước, rồi đến thẻ html...
        order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
        // Nơi lưu lựa chọn ngôn ngữ của người dùng (ở đây là cookie)
        caches: ["cookie"],
    },

    // Cấu hình cho backend (nơi lấy file translation)
    backend: {
        // Đường dẫn tới các file json. {{lng}} sẽ được thay bằng 'en' hoặc 'vi'.
        loadPath: "/locales/{{lng}}/translation.json",
    },

    // Tắt tính năng Suspense của React (cho đơn giản)
    react: { useSuspense: false },
    });

export default i18n;