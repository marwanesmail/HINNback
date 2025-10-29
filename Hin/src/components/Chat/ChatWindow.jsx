import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaUser,
  FaUserMd,
  FaPills,
  FaPhone,
  FaVideo,
  FaTimes,
  FaCheck,
  FaCheckDouble,
  FaPaperclip,
  FaPaperPlane,
  FaSpinner,
  FaBuilding,
} from "react-icons/fa";
import {
  sendMessage,
  getChatMessages,
  markMessagesAsRead,
  MESSAGE_TYPES,
} from "../../services/chatService";

// ----------------------------------------------------------------------
// مكونات مساعدة (متناسقة مع ChatList)
// ----------------------------------------------------------------------

const UserTypeIcon = ({ userType, className = "text-white text-lg" }) => {
  switch (userType) {
    case "patient":
      return <FaUser className={className} />;
    case "doctor":
      return <FaUserMd className={className} />;
    case "pharmacy":
      return <FaPills className={className} />;
    case "company":
      return <FaBuilding className={className} />;
    default:
      return <FaUser className={className} />;
  }
};

const getUserTypeColor = (userType) => {
  switch (userType) {
    case "patient":
      return "bg-gradient-to-br from-cyan-500 to-cyan-600";
    case "doctor":
      return "bg-gradient-to-br from-emerald-500 to-emerald-600";
    case "pharmacy":
      return "bg-gradient-to-br from-violet-500 to-violet-600";
    case "company":
      return "bg-gradient-to-br from-amber-500 to-amber-600";
    default:
      return "bg-gradient-to-br from-slate-500 to-slate-600";
  }
};

// ----------------------------------------------------------------------
// المكون الرئيسي: ChatWindow
// ----------------------------------------------------------------------

const ChatWindow = ({ chat, currentUser, onClose, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  const otherParticipant = chat.participants.find(
    (p) => !(p.id === currentUser.id && p.type === currentUser.type)
  );

  // جلب رسائل المحادثة
  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const chatMessages = await getChatMessages(
        chat.id,
        currentUser.id,
        currentUser.type
      );
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [chat.id, currentUser.id, currentUser.type]);

  // وضع علامة "مقروء" على الرسائل
  const markAsRead = useCallback(async () => {
    setTimeout(async () => {
      try {
        await markMessagesAsRead(chat.id, currentUser.id, currentUser.type);
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }, 500);
  }, [chat.id, currentUser.id, currentUser.type]);

  useEffect(() => {
    loadMessages();
    markAsRead(); 
  }, [chat.id, loadMessages, markAsRead]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: isLoading ? "auto" : "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    const tempMessageId = Date.now();
    const tempMessage = {
      id: tempMessageId,
      message: newMessage.trim(),
      timestamp: tempMessageId,
      senderId: currentUser.id,
      senderType: currentUser.type,
      isRead: false,
      isSending: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    setIsSending(true);

    try {
      const sentMessage = await sendMessage(
        chat.id,
        currentUser.id,
        currentUser.type,
        tempMessage.message,
        MESSAGE_TYPES.TEXT
      );

      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessageId ? { ...sentMessage, isSending: false } : msg))
      );

      if (onMessageSent) {
        onMessageSent(chat.id, sentMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter(msg => msg.id !== tempMessageId));
      alert("فشل في إرسال الرسالة.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = (now - date) / (1000 * 60 * 60 * 24);

    if (diffInDays < 1 && date.toDateString() === now.toDateString()) {
      return "اليوم";
    } else if (diffInDays < 2) {
      return "أمس";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("ar-EG", { weekday: 'long' });
    } else {
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (!otherParticipant) {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-white rounded-2xl shadow-2xl p-8">
            <FaTimes className="text-rose-500 text-3xl mb-4" />
            <p className="text-slate-600 font-semibold">خطأ: لا يمكن العثور على المشارك الآخر في المحادثة.</p>
            <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-colors"
            >
                إغلاق النافذة
            </button>
        </div>
    );
  }

  // ----------------------------------------------------------------------
  // التصميم والعرض
  // ----------------------------------------------------------------------

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl border border-slate-200">
      {/* رأس المحادثة (Chat Header) */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl shadow-lg">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div
            className={`w-11 h-11 ${getUserTypeColor(
              otherParticipant.type
            )} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
          >
            <UserTypeIcon userType={otherParticipant.type} />
          </div>
          <div>
            <h3 className="font-bold text-lg">{otherParticipant.name}</h3>
            <p className="text-sm text-indigo-100 opacity-90">
              {otherParticipant.type === "doctor" && `د. ${otherParticipant.specialty}`}
              {otherParticipant.type === "pharmacy" &&
                `صيدلية في ${otherParticipant.location || 'منطقة غير محددة'}`}
              {otherParticipant.type === "patient" && "مريض"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
            title="مكالمة صوتية (غير مفعّل)"
            disabled
          >
            <FaPhone className="text-base" />
          </button>
          <button
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
            title="مكالمة فيديو (غير مفعّل)"
            disabled
          >
            <FaVideo className="text-base" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 hover:scale-110"
            title="إغلاق المحادثة"
          >
            <FaTimes className="text-base" />
          </button>
        </div>
      </div>

      {/* منطقة الرسائل (Messages Area) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-indigo-600">
            <FaSpinner className="text-3xl animate-spin mb-2" />
            <p className="text-sm">جاري تحميل الرسائل...</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* فاصل التاريخ */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-slate-200 text-slate-700 text-xs font-medium px-4 py-1.5 rounded-full shadow-sm">
                  {date}
                </div>
              </div>

              {/* رسائل هذا اليوم */}
              {dateMessages.map((message) => {
                const isCurrentUser =
                  message.senderId === currentUser.id &&
                  message.senderType === currentUser.type;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={`max-w-[80%] md:max-w-[60%] lg:max-w-[50%] p-3 rounded-2xl shadow-md ${
                        isCurrentUser
                          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none"
                          : "bg-white text-slate-900 rounded-tl-none border border-slate-200"
                      }`}
                      style={{ overflowWrap: 'break-word' }}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
                      <div
                        className={`flex items-center justify-end mt-1 ${
                          isCurrentUser ? "text-indigo-100" : "text-slate-500"
                        } text-xs`}
                      >
                        <span className="ml-2">
                          {formatTime(message.timestamp)}
                        </span>
                        {isCurrentUser && (
                          <>
                            {message.isSending ? (
                                <FaCheck className="text-indigo-300 ml-1" title="قيد الإرسال" />
                            ) : message.isRead ? (
                              <FaCheckDouble className="text-emerald-300 ml-1" title="تمت القراءة" />
                            ) : (
                              <FaCheck className="text-indigo-200 ml-1" title="تم الإرسال" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* حقل إدخال الرسالة (Message Input) */}
      <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl shadow-inner">
        <div className="flex items-end space-x-3 space-x-reverse">
          <button
            className="p-3 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition-all duration-200"
            title="إرفاق ملف (غير مفعّل)"
            disabled
          >
            <FaPaperclip className="text-lg" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
              rows="1"
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className={`p-3 rounded-full transition-all duration-200 shadow-md ${
              newMessage.trim() && !isSending
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:scale-105"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
            title="إرسال"
          >
            {isSending ? (
              <FaSpinner className="animate-spin text-lg" />
            ) : (
              <FaPaperPlane className="text-lg" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;