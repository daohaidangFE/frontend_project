import React, { useState, useEffect } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import messageService from "../../services/messageService";
import MiniChatBox from "./MiniChatBox";

/* Conversation item */
const ConversationItem = ({ conversation, onClick, currentUserId }) => {
  const { t } = useTranslation();
  const { lastMessage, unreadCount, otherUserInfo, receiver  } = conversation;

  const userInfo = otherUserInfo || receiver;

  // Target user
  const targetName = otherUserInfo?.fullName || t("default_user");
  const targetAvatar =
    otherUserInfo?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${targetName}&background=random&size=128`;

  // Last message preview
  let previewText = t("start_chat_now");
  if (lastMessage) {
    if (lastMessage.messageType === "IMAGE") previewText = t("image_message");
    else if (lastMessage.messageType === "RECALLED")
      previewText = t("recalled_message");
    else previewText = lastMessage.content;

    if (String(lastMessage.senderId) === String(currentUserId)) {
      previewText = `${t("you_prefix")}: ${previewText}`;
    }
  }

  const targetUserForChat = {
    id: otherUserInfo?.userId,
    fullName: targetName,
    avatarUrl: targetAvatar,
  };

  return (
    <div
      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b"
      onClick={() => onClick(conversation.id, targetUserForChat)}
    >
      <img
        src={targetAvatar}
        alt="avt"
        className="w-10 h-10 rounded-full object-cover mr-3 border"
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h4 className="text-sm font-bold truncate">{targetName}</h4>
          {lastMessage && (
            <span className="text-[10px] text-gray-400 ml-2 flex-shrink-0">
              {moment(lastMessage.sentAt).fromNow()}
            </span>
          )}
        </div>
        <p
          className={`text-xs ${
            unreadCount > 0 ? "font-bold" : "text-gray-500"
          }`}
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            wordBreak: 'break-all',
            maxWidth: '100%'
          }}
        >
          {previewText}
        </p>
      </div>

      {unreadCount > 0 && (
        <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

/* Chat widget */
const ChatWidget = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (isOpen && !activeChat) loadConversations();
  }, [isOpen, activeChat]);

  const loadConversations = async () => {
    try {
      const data = await messageService.getConversations();
      if (Array.isArray(data)) {
        setConversations(data.filter((c) => c.lastMessage));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectConversation = (conversationId, targetUser) => {
    setActiveChat({ conversationId, targetUser });
  };

  // Chat box view
  if (isOpen && activeChat) {
    return (
      <MiniChatBox
        conversationId={activeChat.conversationId}
        targetUser={activeChat.targetUser}
        currentUser={currentUser}
        onClose={() => {
          setActiveChat(null);
          loadConversations();
        }}
      />
    );
  }

  // Floating button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition"
      >
        💬
      </button>
    );
  }

  // Conversation list
  return (
    <div
      className="fixed bottom-0 right-20 bg-white border shadow-2xl rounded-t-xl z-50 flex flex-col"
      style={{ width: "330px", height: "500px", maxHeight: "80vh" }}
    >
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-bold text-lg">{t("messages_header")}</h3>
        <button onClick={() => setIsOpen(false)}>⌄</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm p-4">
            {t("no_conversations")}
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              currentUserId={currentUserId}
              onClick={handleSelectConversation}
            />
          ))
        )}
      </div>


    </div>
  );
};

export default ChatWidget;