import React from "react";
import moment from "moment";

const ChatMessage = ({ message, isMe }) => {
  // Dữ liệu tin nhắn từ backend
  const { content, messageType, sentAt } = message;

  // Render nội dung theo loại tin nhắn
  const renderContent = () => {
    if (messageType === "RECALLED") {
      return <i className="text-blueGray-400">Tin nhắn đã được thu hồi</i>;
    }

    if (messageType === "IMAGE") {
      return (
        <img
          src={content}
          alt="Chat attachment"
          className="max-w-xs rounded-lg shadow-md mt-1 cursor-pointer hover:opacity-90"
          onClick={() => window.open(content, "_blank")}
        />
      );
    }

    // Mặc định: tin nhắn văn bản
    return <p className="leading-relaxed">{content}</p>;
  };

  return (
    <div className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col max-w-[70%] ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        {/* Bong bóng chat */}
        <div
          className={`px-4 py-2 rounded-2xl shadow-sm text-sm ${
            isMe
              ? "bg-brand text-white rounded-tr-none"
              : "bg-blueGray-200 text-blueGray-700 rounded-tl-none"
          }`}
        >
          {renderContent()}
        </div>

        {/* Thời gian gửi */}
        <span className="text-[10px] text-blueGray-400 mt-1 px-1">
          {moment(sentAt).format("HH:mm")}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
