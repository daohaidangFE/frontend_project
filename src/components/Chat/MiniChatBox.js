import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useTranslation } from "react-i18next";
import messageService from "../../services/messageService";

const WS_URL = "http://localhost:8084/ws";

/* Message item */
const ChatMessageItem = ({ message, isMe }) => {
  const { t } = useTranslation();
  const { content, messageType, sentAt } = message;

  const renderContent = () => {
    if (messageType === "RECALLED") {
      return <i className="text-gray-400 text-xs">{t("recalled_message")}</i>;
    }
    if (messageType === "IMAGE") {
      return (
        <img
          src={content}
          alt="img"
          className="max-w-[150px] rounded-lg cursor-pointer hover:opacity-90 shadow-sm"
          onClick={() => window.open(content, "_blank")}
        />
      );
    }
    return <p className="text-sm break-words whitespace-pre-wrap">{content}</p>;
  };

  return (
    <div className={`flex w-full mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
      {!isMe && (
        <div className="mr-2 self-end flex-shrink-0">
          <img
            src={message.senderInfo?.avatarUrl || "https://ui-avatars.com/api/?name=User&background=random"}
            alt="avt"
            className="w-6 h-6 rounded-full object-cover"
          />
        </div>
      )}

      <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
        <div
          className={`px-3 py-2 rounded-xl shadow-sm ${
            isMe
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
        >
          {renderContent()}
        </div>
        <span className="text-[10px] text-gray-400 mt-1 block">
          {moment(sentAt).format("HH:mm")}
        </span>
      </div>
    </div>
  );
};

/* Chat box */
const MiniChatBox = ({ conversationId, targetUser, currentUser, onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const fileInputRef = useRef(null);

  const checkIsMe = (senderId) => {
    if (!currentUser) return false;
    const myId = currentUser.id || currentUser.userId;
    if (!myId) return false;
    return String(myId) === String(senderId);
  };

  useEffect(() => {
    if (!conversationId) return;
    loadHistory();
    connectWebSocket();
    return () => stompClientRef.current?.disconnect();
  }, [conversationId]);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isMinimized]);

  const loadHistory = async () => {
    try {
      const data = await messageService.getMessages(conversationId);
      if (Array.isArray(data)) setMessages(data.slice().reverse());
    } catch (e) {
      console.error(e);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS(WS_URL);
    const stomp = Stomp.over(socket);
    stomp.debug = () => {}; 

    stomp.connect({}, () => {
      stomp.subscribe(`/topic/conversation/${conversationId}`, (payload) => {
        const event = JSON.parse(payload.body);
        if (event.eventType === "NEW_MESSAGE" || event.type === "NEW_MESSAGE") {
          setMessages((prev) => [...prev, event.payload]);
        }
      });
    });

    stompClientRef.current = stomp;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await messageService.sendTextMessage(conversationId, newMessage);
      setNewMessage("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    messageService
      .sendImageMessage(file, conversationId)
      .catch(() => alert(t("upload_error")));
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-20 w-64 bg-white border border-gray-300 shadow-lg rounded-t-lg z-50">
        <div
          className="flex justify-between items-center p-3 bg-blue-600 text-white cursor-pointer rounded-t-lg"
          onClick={() => setIsMinimized(false)}
        >
          <span className="text-sm font-bold truncate">
            {targetUser?.fullName || t("default_header")}
          </span>
          <button
            className="hover:text-gray-200 px-2 font-bold"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
        className="fixed bottom-0 right-20 w-[330px] bg-white border border-gray-300 shadow-2xl rounded-t-xl z-50 flex flex-col font-sans"
        style={{ maxHeight: '500px', height: 'auto' }}
    >
      
      {/* 1. HEADER */}
      <div
        className="flex-none flex justify-between items-center px-4 border-b border-gray-200 bg-white rounded-t-xl cursor-pointer hover:bg-gray-50"
        style={{ height: '45px' }} 
        onClick={() => setIsMinimized(true)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="relative flex-shrink-0">
             <img
                src={targetUser?.avatarUrl || "https://ui-avatars.com/api/?name=User&background=random"}
                alt="avt"
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <span className="font-bold text-gray-800 text-sm truncate">
            {targetUser?.fullName || t("default_header")}
          </span>
        </div>
        <div className="flex gap-1 text-blue-600 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="p-1 hover:bg-blue-50 rounded"
          >
            _
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-blue-50 rounded text-lg leading-none"
          >
            &times;
          </button>
        </div>
      </div>

      <div 
        className="flex-1 bg-white p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        style={{ height: '150px', overflowY: 'auto' }}
      >
        {messages.length === 0 && (
            <div className="text-center text-gray-400 text-xs mt-10">
                Hãy bắt đầu trò chuyện...
            </div>
        )}
        
        {messages.map((msg) => (
          <ChatMessageItem
            key={msg.id}
            message={msg}
            isMe={checkIsMe(msg.senderId)} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. FOOTER */}
      <div className="flex-none p-3 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-500 hover:text-blue-600 p-1"
          >
            📷
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <input
            type="text"
            className="flex-1 bg-gray-100 text-sm px-4 py-2 rounded-full outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={t("input_placeholder")}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default MiniChatBox;