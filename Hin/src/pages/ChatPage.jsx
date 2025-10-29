import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaArrowRight } from 'react-icons/fa';
import ChatList from '../components/Chat/ChatList';
import ChatWindow from '../components/Chat/ChatWindow';
import { initializeSampleChats, USER_TYPES } from '../services/chatService';

const ChatPage = ({ userType = USER_TYPES.PATIENT, userId = '01234567890' }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    initializeSampleChats();
    setCurrentUser(getUserData(userType, userId));
  }, [userType, userId]);

  const getUserData = (type, id) => {
    const userData = {
      [USER_TYPES.PATIENT]: {
        id: '01234567890',
        type: USER_TYPES.PATIENT,
        name: 'أحمد محمد علي',
        avatar: null
      },
      [USER_TYPES.DOCTOR]: {
        id: 'dr_001',
        type: USER_TYPES.DOCTOR,
        name: 'د. أحمد محمد',
        specialty: 'طب باطنة'
      },
      [USER_TYPES.PHARMACY]: {
        id: 'pharmacy_001',
        type: USER_TYPES.PHARMACY,
        name: 'صيدلية الشفاء',
        location: 'شارع الجمهورية'
      },
      [USER_TYPES.COMPANY]: {
        id: 'company_001',
        type: USER_TYPES.COMPANY,
        name: 'شركة الأدوية الحديثة'
      }
    };

    return userData[type] || userData[USER_TYPES.PATIENT];
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleMessageSent = (chatId, message) => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const chatListVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  
  const chatWindowVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  
  const noChatVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
            className="rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
          ></motion.div>
          <p className="text-gray-600">جاري تحميل المحادثات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4"
      >
        <h1 className="text-xl font-bold text-gray-900 flex items-center">
          <FaComments className="text-blue-600 ml-2" />
          المحادثات
        </h1>
      </motion.div>

      <div className="flex h-screen lg:h-[calc(100vh-4rem)]">
        <AnimatePresence mode="wait">
          {!selectedChat && (
            <motion.div
              key="chat-list"
              variants={chatListVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full lg:w-1/3 xl:w-1/4 border-r border-gray-200 block"
            >
              <ChatList
                currentUser={currentUser}
                onChatSelect={handleChatSelect}
                selectedChatId={selectedChat?.id}
                refreshTrigger={refreshTrigger}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {selectedChat ? (
            <motion.div
              key="chat-window"
              variants={chatWindowVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex-1 block"
            >
              <ChatWindow
                chat={selectedChat}
                currentUser={currentUser}
                onClose={handleCloseChat}
                onMessageSent={handleMessageSent}
              />
            </motion.div>
          ) : (
            <motion.div
              key="no-chat"
              variants={noChatVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex-1 hidden lg:flex lg:items-center lg:justify-center"
            >
              <div className="text-center text-gray-500 p-8">
                <FaComments className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  اختر محادثة للبدء
                </h3>
                <p className="text-gray-500">
                  اختر محادثة من القائمة أو ابدأ محادثة جديدة
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedChat && (
        <motion.button
          onClick={handleCloseChat}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="lg:hidden fixed top-4 right-4 z-50 bg-white rounded-full p-3 shadow-lg border border-gray-200"
        >
          <FaArrowRight className="text-gray-600" />
        </motion.button>
      )}
    </div>
  );
};

export default ChatPage;