import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useTranslation } from "react-i18next";
import messageService from "../../services/messageService";

const WS_URL = process.env.REACT_APP_WS_URL

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
    return (
      <p 
        style={{ 
          fontSize: '14px',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          margin: 0,
          padding: 0
        }}
      >
        {content}
      </p>
    );
  };

  return (
    <div 
      style={{
        display: 'flex',
        width: '100%',
        marginBottom: '12px',
        justifyContent: isMe ? 'flex-end' : 'flex-start'
      }}
    >
      {!isMe && (
        <div style={{ marginRight: '8px', alignSelf: 'flex-end', flexShrink: 0 }}>
          <img
            src={message.senderInfo?.avatarUrl || "https://ui-avatars.com/api/?name=User&background=random"}
            alt="avt"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      <div 
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMe ? 'flex-end' : 'flex-start',
          maxWidth: '220px'
        }}
      >
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '12px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            backgroundColor: isMe ? '#2563eb' : '#e5e7eb',
            color: isMe ? 'white' : '#1f2937',
            borderBottomRightRadius: isMe ? '0' : '12px',
            borderBottomLeftRadius: isMe ? '12px' : '0',
            maxWidth: '220px',
            wordBreak: 'break-word'
          }}
        >
          {renderContent()}
        </div>
        <span style={{
          fontSize: '10px',
          color: '#9ca3af',
          marginTop: '4px',
          display: 'block'
        }}>
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
      <div 
        className="fixed bottom-0 right-20 bg-white border border-gray-300 shadow-lg rounded-t-lg z-50"
        style={{ width: '256px' }}
      >
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
        style={{
          position: 'fixed',
          bottom: 0,
          right: '80px',
          width: '330px',
          height: '500px',
          maxHeight: '80vh',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
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

      {/* 2. MESSAGES */}
      <div 
        style={{ 
          flex: 1,
          backgroundColor: 'white',
          padding: '12px',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {messages.length === 0 && (
            <div style={{
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '12px',
              marginTop: '40px'
            }}>
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
            className="text-blue-500 hover:text-blue-600 p-1 flex-shrink-0"
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
            className="text-blue-600 hover:text-blue-700 disabled:opacity-50 flex-shrink-0"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default MiniChatBox;