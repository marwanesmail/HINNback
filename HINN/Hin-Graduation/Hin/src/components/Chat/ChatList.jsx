import React, { useState, useEffect, useCallback } from "react";
import {
  FaUser,
  FaUserMd,
  FaPills,
  FaPlus,
  FaSearch,
  FaComments,
  FaTimes,
  FaSpinner,
  FaBuilding,
} from "react-icons/fa";
import {
  getUserChats,
  getUnreadMessageCount,
  searchChats,
  getChatParticipants,
  getOrCreateChat,
} from "../../services/chatService";

// ----------------------------------------------------------------------
// مكون مساعد: أيقونة نوع المستخدم
// ----------------------------------------------------------------------

const UserTypeIcon = ({ userType, className = "text-white" }) => {
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
// المكون الرئيسي: ChatList
// ----------------------------------------------------------------------

const ChatList = ({
  currentUser,
  onChatSelect,
  selectedChatId,
  refreshTrigger,
}) => {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [unreadTotalCount, setUnreadTotalCount] = useState(0);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableParticipants, setAvailableParticipants] = useState([]);

  // جلب المحادثات
  const loadChats = useCallback(async (query = "") => {
    setIsLoading(true);
    try {
      const serviceCall = query.trim()
        ? searchChats(currentUser.id, currentUser.type, query)
        : getUserChats(currentUser.id, currentUser.type);
      
      const userChats = await serviceCall;
      setChats(userChats);
    } catch (error) {
      console.error("Error loading or searching chats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.id, currentUser.type]);

  // جلب إجمالي عدد الرسائل غير المقروءة
  const loadUnreadTotalCount = useCallback(async () => {
    try {
      const count = await getUnreadMessageCount(
        currentUser.id,
        currentUser.type
      );
      setUnreadTotalCount(count);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  }, [currentUser.id, currentUser.type]);

  // تأثير لـ (التحميل الأولي، إعادة التحميل، وتغيير المستخدم)
  useEffect(() => {
    loadChats(searchQuery);
    loadUnreadTotalCount();
  }, [currentUser, refreshTrigger, searchQuery, loadChats, loadUnreadTotalCount]); 

  // جلب المشاركين المتاحين للمحادثة الجديدة
  const loadAvailableParticipants = useCallback(async () => {
    try {
      const participants = await getChatParticipants(
        currentUser.id,
        currentUser.type
      );
      setAvailableParticipants(participants);
    } catch (error) {
      console.error("Error loading participants:", error);
    }
  }, [currentUser.id, currentUser.type]);

  const handleOpenNewChatModal = () => {
    setShowNewChatModal(true);
    loadAvailableParticipants();
  };

  const handleNewChat = async (participant) => {
    try {
      const chat = await getOrCreateChat(currentUser, participant);
      setShowNewChatModal(false);
      onChatSelect(chat);
      loadChats("");
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  // تنسيق وقت آخر رسالة
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = (now - date) / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
      return date.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("ar-EG", { weekday: 'short' });
    } else {
      return date.toLocaleDateString("ar-EG", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      });
    }
  };

  // جلب المشارك الآخر
  const getOtherParticipant = (chat) => {
    return chat.participants.find(
      (p) => !(p.id === currentUser.id && p.type === currentUser.type)
    );
  };
  
  // ----------------------------------------------------------------------
  // التصميم والعرض
  // ----------------------------------------------------------------------

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 shadow-xl">
      {/* رأس القائمة (Header) */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold flex items-center">
            <FaComments className="ml-2" />
            المحادثات
          </h2>
          <div className="flex items-center space-x-3 space-x-reverse">
            {/* إجمالي عدد الرسائل غير المقروءة */}
            {unreadTotalCount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse shadow-lg">
                {unreadTotalCount}
              </span>
            )}
            <button
              onClick={handleOpenNewChatModal}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200 hover:scale-110"
              title="محادثة جديدة"
            >
              <FaPlus className="text-white" />
            </button>
          </div>
        </div>

        {/* حقل البحث */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في المحادثات..."
            className="w-full px-4 py-2 pr-10 bg-white bg-opacity-95 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* قائمة المحادثات (Chat List) */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          // شاشة التحميل (Loading State)
          <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-indigo-600">
            <FaSpinner className="text-3xl animate-spin mb-2" />
            <p className="text-sm">جاري تحميل المحادثات...</p>
          </div>
        ) : chats.length === 0 ? (
          // لا توجد محادثات (Empty State)
          <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-slate-500 p-4 text-center">
            <FaComments className="text-5xl mb-3 text-slate-300" />
            <p className="text-base font-medium mb-3">لا توجد محادثات لعرضها.</p>
            <button
              onClick={handleOpenNewChatModal}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <FaPlus className="inline ml-2" /> ابدأ محادثة جديدة
            </button>
          </div>
        ) : (
          // عرض المحادثات
          <div className="divide-y divide-slate-100">
            {chats.map((chat) => {
              const otherParticipant = getOtherParticipant(chat);
              if (!otherParticipant) return null;

              const isSelected = chat.id === selectedChatId;
              const hasUnread = (chat.unreadCount?.[currentUser.id] || 0) > 0;
              const unreadCountForChat = chat.unreadCount?.[currentUser.id] || 0;

              return (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat)}
                  className={`p-4 cursor-pointer transition-all duration-150 flex items-center ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-r-4 border-indigo-500 shadow-inner"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {/* الأيقونة والصورة الشخصية */}
                  <div className="relative flex-shrink-0 ml-3">
                    <div
                      className={`w-12 h-12 ${getUserTypeColor(
                        otherParticipant.type
                      )} rounded-full flex items-center justify-center shadow-md`}
                    >
                      <UserTypeIcon
                        userType={otherParticipant.type}
                        className="text-white text-xl"
                      />
                    </div>
                    {/* شارة الرسائل غير المقروءة */}
                    {hasUnread && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">
                          {unreadCountForChat > 9 ? "9+" : unreadCountForChat}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* تفاصيل المحادثة */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-semibold truncate text-base ${
                          hasUnread ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {otherParticipant.name}
                      </h3>
                      <span className="text-xs text-slate-500 flex-shrink-0 mr-2">
                        {formatLastMessageTime(chat.lastMessageAt)}
                      </span>
                    </div>

                    <div className="mt-1">
                      <p
                        className={`text-sm truncate ${
                          hasUnread
                            ? "text-slate-900 font-medium"
                            : "text-slate-600"
                        }`}
                      >
                        {chat.lastMessage?.message || "لا توجد رسائل بعد..."}
                      </p>
                    </div>

                    {/* السياق والنوع (Context/Type) */}
                    <p className="text-xs text-slate-500 mt-1 flex items-center">
                      {otherParticipant.type === "doctor" && (
                        <span className="text-emerald-600 font-medium">
                          د. {otherParticipant.specialty}
                        </span>
                      )}
                      {otherParticipant.type === "pharmacy" && (
                        <span>
                          صيدلية: {otherParticipant.location || 'غير محدد'}
                        </span>
                      )}
                      {otherParticipant.type === "patient" && (
                        <span>مريض</span>
                      )}
                      
                      {chat.context && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex-shrink-0 mr-2">
                            {chat.context.type === "prescription" && "روشتة"}
                            {chat.context.type === "appointment" && "موعد"}
                            {chat.context.type === "general" && "عام"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* مودال المحادثة الجديدة (New Chat Modal) */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-200">
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                بدء محادثة جديدة
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100"
                aria-label="إغلاق"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-2">
              {availableParticipants.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  لا توجد جهات متاحة حاليًا لبدء محادثة.
                </p>
              ) : (
                availableParticipants.map((participant) => (
                  <div
                    key={`${participant.type}_${participant.id}`}
                    onClick={() => handleNewChat(participant)}
                    className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-indigo-200 hover:shadow-md"
                  >
                    <div
                      className={`w-10 h-10 ${getUserTypeColor(
                        participant.type
                      )} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
                    >
                      <UserTypeIcon
                        userType={participant.type}
                        className="text-white text-lg"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {participant.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {participant.type === "doctor" &&
                          `طبيب متخصص في ${participant.specialty}`}
                        {participant.type === "pharmacy" &&
                          `صيدلية في ${participant.location}`}
                        {participant.type === "patient" && "مريض"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;