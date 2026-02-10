// src/services/chatService.js
// TODO: ربط مع API هنا - سيتم استبدال جميع الوظائف بطلبات API فعلية
import { v4 as uuidv4 } from "uuid";
import { createChatMessageNotification } from "./notificationService";

// Chat storage keys
const CHAT_STORAGE_KEY = "healthcare_chats";
const CHAT_PARTICIPANTS_KEY = "chat_participants";

// User types
export const USER_TYPES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  PHARMACY: "pharmacy",
  COMPANY: "company",
};

// Message types
export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  PRESCRIPTION: "prescription",
  APPOINTMENT: "appointment",
  SYSTEM: "system",
};

// Get all chats from localStorage
const getChatsFromStorage = () => {
  try {
    const chats = localStorage.getItem(CHAT_STORAGE_KEY);
    return chats ? JSON.parse(chats) : [];
  } catch (error) {
    console.error("Error loading chats:", error);
    return [];
  }
};

// Save chats to localStorage
const saveChatsToStorage = (chats) => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Error saving chats:", error);
  }
};

// Get chat participants from localStorage
const getParticipantsFromStorage = () => {
  try {
    const participants = localStorage.getItem(CHAT_PARTICIPANTS_KEY);
    return participants ? JSON.parse(participants) : [];
  } catch (error) {
    console.error("Error loading participants:", error);
    return [];
  }
};

// Save chat participants to localStorage
const saveParticipantsToStorage = (participants) => {
  try {
    localStorage.setItem(CHAT_PARTICIPANTS_KEY, JSON.stringify(participants));
  } catch (error) {
    console.error("Error saving participants:", error);
  }
};

// Create a new chat between two users
export const createChat = async (user1, user2, context = null) => {
  // TODO: ربط مع API هنا - POST /api/chats
  // نوع البيانات المطلوبة: { user1, user2, context }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { id, participants, context, createdAt, lastMessageAt, lastMessage, unreadCount, messages }
  const chatId = uuidv4();
  const timestamp = new Date().toISOString();

  const newChat = {
    id: chatId,
    participants: [user1, user2],
    context: context, // e.g., { type: 'prescription', id: 'prescription_id' }
    createdAt: timestamp,
    lastMessageAt: timestamp,
    lastMessage: null,
    unreadCount: {
      [user1.id]: 0,
      [user2.id]: 0,
    },
    messages: [],
  };

  const chats = getChatsFromStorage();
  chats.push(newChat);
  saveChatsToStorage(chats);

  // Add participants to participants list
  const participants = getParticipantsFromStorage();
  [user1, user2].forEach((user) => {
    const existingParticipant = participants.find(
      (p) => p.id === user.id && p.type === user.type
    );
    if (!existingParticipant) {
      participants.push(user);
    }
  });
  saveParticipantsToStorage(participants);

  return newChat;
};

// Get or create chat between two users
export const getOrCreateChat = async (user1, user2, context = null) => {
  const chats = getChatsFromStorage();

  // Find existing chat between these users
  const existingChat = chats.find((chat) => {
    const participantIds = chat.participants.map((p) => `${p.type}_${p.id}`);
    const user1Id = `${user1.type}_${user1.id}`;
    const user2Id = `${user2.type}_${user2.id}`;
    return participantIds.includes(user1Id) && participantIds.includes(user2Id);
  });

  if (existingChat) {
    return existingChat;
  }

  // Create new chat if none exists
  return await createChat(user1, user2, context);
};

// Send a message in a chat
export const sendMessage = async (
  chatId,
  senderId,
  senderType,
  message,
  messageType = MESSAGE_TYPES.TEXT
) => {
  // TODO: ربط مع API هنا - POST /api/chats/{chatId}/messages
  // نوع البيانات المطلوبة: path param { chatId }, body { senderId, senderType, message, messageType }
  // Headers: Content-Type: application/json, Authorization: Bearer {token}
  // البيانات الراجعة: { id, senderId, senderType, message, messageType, timestamp, isRead, reactions }
  const chats = getChatsFromStorage();
  const chatIndex = chats.findIndex((chat) => chat.id === chatId);

  if (chatIndex === -1) {
    throw new Error("Chat not found");
  }

  const timestamp = new Date().toISOString();
  const messageId = uuidv4();

  const newMessage = {
    id: messageId,
    senderId,
    senderType,
    message,
    messageType,
    timestamp,
    isRead: false,
    reactions: [],
  };

  chats[chatIndex].messages.push(newMessage);
  chats[chatIndex].lastMessage = newMessage;
  chats[chatIndex].lastMessageAt = timestamp;

  // Update unread count for other participants and send notifications
  const senderParticipant = chats[chatIndex].participants.find(
    (p) => p.id === senderId && p.type === senderType
  );

  chats[chatIndex].participants.forEach(async (participant) => {
    if (participant.id !== senderId || participant.type !== senderType) {
      const participantKey = participant.id;
      chats[chatIndex].unreadCount[participantKey] =
        (chats[chatIndex].unreadCount[participantKey] || 0) + 1;

      // إرسال إشعار للمشارك الآخر
      try {
        await createChatMessageNotification({
          recipientId: participant.id,
          recipientType: participant.type,
          senderId: senderId,
          senderType: senderType,
          senderName: senderParticipant?.name || `${senderType}`,
          chatId: chatId,
          messageId: messageId,
          messageText: message,
        });
      } catch (error) {
        console.error("Error sending chat notification:", error);
      }
    }
  });

  saveChatsToStorage(chats);
  return newMessage;
};

// Get all chats for a specific user
// TODO: ربط مع API هنا - GET /api/chats/user/{userId}?userType={userType}
// نوع البيانات المطلوبة: path param { userId }, query param { userType }
// Headers: Content-Type: application/json, Authorization: Bearer {token}
// البيانات الراجعة: [{ id, participants, context, createdAt, lastMessageAt, lastMessage, unreadCount, messages }]
export const getUserChats = async (userId, userType) => {
  const chats = getChatsFromStorage();

  return chats
    .filter((chat) => {
      return chat.participants.some(
        (participant) =>
          participant.id === userId && participant.type === userType
      );
    })
    .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
};

// Get messages for a specific chat
// TODO: ربط مع API هنا - GET /api/chats/{chatId}/messages
// نوع البيانات المطلوبة: path param { chatId }
// Headers: Content-Type: application/json, Authorization: Bearer {token}
// البيانات الراجعة: [{ id, senderId, senderType, message, messageType, timestamp, isRead, reactions }]
export const getChatMessages = async (chatId, userId, userType) => {
  const chats = getChatsFromStorage();
  const chat = chats.find((chat) => chat.id === chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  // Check if user is participant
  const isParticipant = chat.participants.some(
    (participant) => participant.id === userId && participant.type === userType
  );

  if (!isParticipant) {
    throw new Error("User is not a participant in this chat");
  }

  return chat.messages;
};

// Mark messages as read
// TODO: ربط مع API هنا - PUT /api/chats/{chatId}/messages/read
// نوع البيانات المطلوبة: path param { chatId }
// Headers: Content-Type: application/json, Authorization: Bearer {token}
// البيانات الراجعة: { success: true }
export const markMessagesAsRead = async (chatId, userId, userType) => {
  const chats = getChatsFromStorage();
  const chatIndex = chats.findIndex((chat) => chat.id === chatId);

  if (chatIndex === -1) {
    throw new Error("Chat not found");
  }

  // Mark all messages as read for this user
  chats[chatIndex].messages.forEach((message) => {
    if (message.senderId !== userId || message.senderType !== userType) {
      message.isRead = true;
    }
  });

  // Reset unread count for this user
  chats[chatIndex].unreadCount[userId] = 0;

  saveChatsToStorage(chats);
};

// Get unread message count for a user
// TODO: ربط مع API هنا - GET /api/chats/unread-count?userId={userId}&userType={userType}
// نوع البيانات المطلوبة: query params { userId, userType }
// Headers: Content-Type: application/json, Authorization: Bearer {token}
// البيانات الراجعة: { count: number }
export const getUnreadMessageCount = async (userId, userType) => {
  const chats = getChatsFromStorage();

  let totalUnread = 0;
  chats.forEach((chat) => {
    const isParticipant = chat.participants.some(
      (participant) =>
        participant.id === userId && participant.type === userType
    );

    if (isParticipant) {
      totalUnread += chat.unreadCount[userId] || 0;
    }
  });

  return totalUnread;
};

// Get chat participants (for search/selection)
// TODO: ربط مع API هنا - GET /api/chats/participants?currentUserId={currentUserId}&currentUserType={currentUserType}
// نوع البيانات المطلوبة: query params { currentUserId, currentUserType }
// Headers: Content-Type: application/json, Authorization: Bearer {token}
// البيانات الراجعة: [{ id, type, name, specialty, location }]
export const getChatParticipants = async (currentUserId, currentUserType) => {
  const participants = getParticipantsFromStorage();

  // Filter out current user and return others
  return participants.filter(
    (participant) =>
      !(
        participant.id === currentUserId && participant.type === currentUserType
      )
  );
};

// Search chats by participant name or message content
// TODO: ربط مع API هنا - GET /api/chats/search?userId={userId}&userType={userType}&query={query}
// نوع البيانات المطلوبة: query params { userId, userType, query }
// Headers: Content-Type: application/json, Authorization: Bearer {token}
// البيانات الراجعة: [{ id, participants, context, createdAt, lastMessageAt, lastMessage, unreadCount, messages }]
export const searchChats = async (userId, userType, query) => {
  const userChats = await getUserChats(userId, userType);

  if (!query.trim()) {
    return userChats;
  }

  const searchTerm = query.toLowerCase();

  return userChats.filter((chat) => {
    // Search in participant names
    const participantMatch = chat.participants.some((participant) =>
      participant.name.toLowerCase().includes(searchTerm)
    );

    // Search in recent messages
    const messageMatch = chat.messages.some((message) =>
      message.message.toLowerCase().includes(searchTerm)
    );

    return participantMatch || messageMatch;
  });
};

// Delete a chat
// TODO: ربط مع API هنا - DELETE /api/chats/{chatId}
// نوع البيانات المطلوبة: path param { chatId }
// Headers: Content-Type: application/json, Authorization: Bearer {token}
// البيانات الراجعة: { success: true }
export const deleteChat = async (chatId, userId, userType) => {
  const chats = getChatsFromStorage();
  const chatIndex = chats.findIndex((chat) => chat.id === chatId);

  if (chatIndex === -1) {
    throw new Error("Chat not found");
  }

  // Check if user is participant
  const isParticipant = chats[chatIndex].participants.some(
    (participant) => participant.id === userId && participant.type === userType
  );

  if (!isParticipant) {
    throw new Error("User is not authorized to delete this chat");
  }

  chats.splice(chatIndex, 1);
  saveChatsToStorage(chats);
};

// Initialize sample data for testing
export const initializeSampleChats = async () => {
  const existingChats = getChatsFromStorage();
  if (existingChats.length > 0) {
    return; // Already initialized
  }

  // Sample participants
  const sampleParticipants = [
    {
      id: "01234567890",
      type: USER_TYPES.PATIENT,
      name: "أحمد محمد علي",
      avatar: null,
    },
    {
      id: "dr_001",
      type: USER_TYPES.DOCTOR,
      name: "د. أحمد محمد",
      specialty: "طب باطنة",
    },
    {
      id: "dr_002",
      type: USER_TYPES.DOCTOR,
      name: "د. فاطمة علي",
      specialty: "طب أطفال",
    },
    {
      id: "pharmacy_001",
      type: USER_TYPES.PHARMACY,
      name: "صيدلية الشفاء",
      location: "شارع الجمهورية",
    },
    {
      id: "pharmacy_002",
      type: USER_TYPES.PHARMACY,
      name: "صيدلية النور",
      location: "شارع النيل",
    },
    {
      id: "company_001",
      type: USER_TYPES.COMPANY,
      name: "شركة الأدوية الحديثة",
    },
  ];

  saveParticipantsToStorage(sampleParticipants);

  // Create sample chats
  const patient = sampleParticipants[0];
  const doctor1 = sampleParticipants[1];
  // const doctor2 = sampleParticipants[2];
  const pharmacy1 = sampleParticipants[3];
  // const pharmacy2 = sampleParticipants[4];
  const company = sampleParticipants[5];

  // Patient-Doctor chat
  const chat1 = await createChat(patient, doctor1, {
    type: "appointment",
    id: "apt_001",
  });
  await sendMessage(
    chat1.id,
    doctor1.id,
    doctor1.type,
    "مرحباً أحمد، كيف حالك اليوم؟"
  );
  await sendMessage(
    chat1.id,
    patient.id,
    patient.type,
    "الحمد لله دكتور، أشعر بتحسن"
  );
  await sendMessage(
    chat1.id,
    doctor1.id,
    doctor1.type,
    "ممتاز! استمر على الأدوية كما وصفتها لك"
  );

  // Patient-Pharmacy chat
  const chat2 = await createChat(patient, pharmacy1, {
    type: "prescription",
    id: "rx_001",
  });
  await sendMessage(
    chat2.id,
    patient.id,
    patient.type,
    "مرحباً، هل الدواء متوفر؟"
  );
  await sendMessage(
    chat2.id,
    pharmacy1.id,
    pharmacy1.type,
    "نعم متوفر، يمكنك الحضور لاستلامه"
  );

  // Doctor-Pharmacy chat
  const chat3 = await createChat(doctor1, pharmacy1, {
    type: "prescription",
    id: "rx_002",
  });
  await sendMessage(
    chat3.id,
    doctor1.id,
    doctor1.type,
    "هل يمكن توفير دواء بديل للمريض أحمد؟"
  );
  await sendMessage(
    chat3.id,
    pharmacy1.id,
    pharmacy1.type,
    "نعم، لدينا البديل المناسب"
  );

  // Company-Pharmacy chat
  const chat4 = await createChat(company, pharmacy1, {
    type: "order",
    id: "order_001",
  });
  await sendMessage(
    chat4.id,
    company.id,
    company.type,
    "مرحباً، هل يمكن تزويدكم بـ 100 وحدة من باراسيتامول 500mg؟"
  );
  await sendMessage(
    chat4.id,
    pharmacy1.id,
    pharmacy1.type,
    "نعم، يمكننا تزويدكم بذلك. متى يمكنكم استلامها؟"
  );

  console.log("Sample chats initialized successfully");
};

// دالة لإرسال رسالة تجريبية من طبيب للمريض (لاختبار الإشعارات)
export const sendTestMessageToPatient = async () => {
  const patient = {
    id: "01234567890",
    type: USER_TYPES.PATIENT,
    name: "محمد محمد مصطفي",
  };
  const doctor = {
    id: "dr_001",
    type: USER_TYPES.DOCTOR,
    name: "د. أحمد محمد",
  };

  try {
    // الحصول على المحادثة أو إنشاؤها
    const chat = await getOrCreateChat(doctor, patient);

    // إرسال رسالة من الطبيب للمريض
    const message = await sendMessage(
      chat.id,
      doctor.id,
      doctor.type,
      "مرحباً، كيف حالك اليوم؟ أتمنى أن تكون بخير.",
      MESSAGE_TYPES.TEXT
    );

    console.log("Test message sent successfully:", message);
    return message;
  } catch (error) {
    console.error("Error sending test message:", error);
    throw error;
  }
};
