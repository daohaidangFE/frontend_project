import React from "react";
import { useTranslation } from "react-i18next";

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  cancelText,
  isDanger = false 
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <>
      {/* Container chính: Đóng vai trò là Backdrop có thể click */}
      <div 
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={onClose} // Nhấn ra vùng trống sẽ gọi onClose
      >
        <div 
          className="relative w-auto my-6 mx-auto max-w-sm"
          onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra ngoài làm đóng modal
        >
          {/* Content */}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-xl font-semibold">
                {title}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-30 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:opacity-100"
                onClick={onClose}
              >
                <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            
            {/* Body */}
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                {message}
              </p>
            </div>
            
            {/* Footer (Actions) */}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-blueGray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={onClose}
              >
                {cancelText || t('cancel')}
              </button>
              <button
                className={`${isDanger ? 'bg-red-500 active:bg-red-600' : 'bg-emerald-500 active:bg-emerald-600'} text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                type="button"
                onClick={onConfirm}
              >
                {confirmText || t('confirm')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Black Overlay (Chỉ dùng để làm mờ nền) */}
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}