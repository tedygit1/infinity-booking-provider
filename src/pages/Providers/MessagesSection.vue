<template>
  <div class="messages-section">
    <h2 class="title">💬 Messages</h2>
    <p class="subtitle">Communicate with your clients in real time</p>

    <div class="chat-container">
      <!-- ✅ USERS LIST (Hidden on mobile when chat open) -->
      <div
        class="chat-list"
        :class="{ 'mobile-hidden': isChatOpenOnMobile }"
      >
        <!-- Search -->
        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search clients..."
            aria-label="Search clients"
          />
        </div>

        <!-- User List -->
        <div class="chat-users">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="chat-user"
            :class="{ active: selectedUser?.id === user.id }"
            @click="selectUser(user)"
            tabindex="0"
            @keydown.enter="selectUser(user)"
          >
            <div class="avatar">
              <span>{{ user.name.charAt(0) }}</span>
              <span class="online-dot" :class="{ offline: !user.isOnline }"></span>
            </div>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="last-message">
                {{ user.messages[user.messages.length - 1]?.text?.substring(0, 30) || 'No messages' }}
              </div>
            </div>
            <div v-if="user.unread > 0" class="unread-badge">{{ user.unread }}</div>
          </div>

          <div v-if="filteredUsers.length === 0" class="empty-list">
            No clients found
          </div>
        </div>
      </div>

      <!-- ✅ CHAT BOX -->
      <div
        class="chat-box"
        :class="{ 'mobile-full': isChatOpenOnMobile }"
      >
        <!-- Mobile Back Button -->
        <button
          v-if="isMobileView && selectedUser"
          class="mobile-back-btn"
          @click="closeChatOnMobile"
          aria-label="Back to contacts"
        >
          ← Back
        </button>

        <!-- Chat Header -->
        <div v-if="selectedUser" class="chat-header">
          <div class="header-left">
            <div class="avatar big">
              <span>{{ selectedUser.name.charAt(0) }}</span>
              <span class="online-dot" :class="{ offline: !selectedUser.isOnline }"></span>
            </div>
            <div>
              <h3>{{ selectedUser.name }}</h3>
              <p class="status-text">{{ selectedUser.isOnline ? 'Online' : 'Offline' }}</p>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div v-if="selectedUser" class="chat-messages" ref="messageContainer">
          <div
            v-for="(msg, i) in selectedUser.messages"
            :key="i"
            :class="['message', msg.from === 'me' ? 'sent' : 'received']"
          >
            <p class="msg-text">{{ msg.text }}</p>
            <span class="msg-time">{{ formatTimeAgo(msg.timestamp) }}</span>
            <span v-if="msg.from === 'me' && msg.read" class="read-indicator">✓✓</span>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>

        <!-- Placeholder -->
        <div v-else class="chat-placeholder">
          <p>Select a client to start chatting 💬</p>
          <p class="hint">Messages are end-to-end encrypted</p>
        </div>

        <!-- Input -->
        <div v-if="selectedUser" class="chat-input">
          <input
            v-model="messageText"
            type="text"
            placeholder="Type a message..."
            @keyup.enter="sendMessage"
            ref="messageInput"
            autocomplete="off"
          />
          <button @click="sendMessage" :disabled="!messageText.trim()">
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from "vue";

// --- Reactive State ---
const users = ref([
  {
    id: 1,
    name: "Sara",
    isOnline: true,
    unread: 2,
    messages: [
      { from: "Sara", text: "Hi! Are you available this weekend?", time: "10:30 AM", timestamp: Date.now() - 3600000 },
      { from: "me", text: "Yes! I have slots on Saturday.", time: "10:32 AM", timestamp: Date.now() - 3480000, read: true },
      { from: "Sara", text: "Perfect! I'll book now 😊", time: "10:35 AM", timestamp: Date.now() - 3300000 },
    ],
  },
  {
    id: 2,
    name: "Dawit",
    isOnline: false,
    unread: 0,
    messages: [
      { from: "Dawit", text: "Is the service available?", time: "11:00 AM", timestamp: Date.now() - 86400000 },
    ],
  },
  {
    id: 3,
    name: "Mekdes",
    isOnline: true,
    unread: 1,
    messages: [
      { from: "Mekdes", text: "Thanks for yesterday!", time: "2:15 PM", timestamp: Date.now() - 1800000 },
    ],
  },
]);

const selectedUser = ref(null);
const messageText = ref("");
const searchQuery = ref("");
const messageContainer = ref(null);
const messageInput = ref(null);
const isTyping = ref(false);

// --- Computed ---
const isMobileView = computed(() => window.innerWidth < 768);
const isChatOpenOnMobile = computed(() => isMobileView.value && selectedUser.value);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  return users.value.filter(user =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- Methods ---
function selectUser(user) {
  selectedUser.value = user;
  // Mark as read
  user.unread = 0;
  nextTick(() => {
    scrollToBottom();
    if (messageInput.value) messageInput.value.focus();
  });
}

function sendMessage() {
  if (!messageText.value.trim() || !selectedUser.value) return;

  const now = new Date();
  const timestamp = now.getTime();

  selectedUser.value.messages.push({
    from: "me",
    text: messageText.value,
    timestamp,
    read: false, // will be marked read later (simulated)
  });

  // Simulate read receipt after delay
  setTimeout(() => {
    const lastMsg = selectedUser.value.messages[selectedUser.value.messages.length - 1];
    if (lastMsg.from === "me") lastMsg.read = true;
  }, 2000);

  messageText.value = "";
  nextTick(scrollToBottom);

  // Simulate typing indicator for reply (optional realism)
  if (selectedUser.value.isOnline) {
    isTyping.value = true;
    setTimeout(() => {
      isTyping.value = false;
      // Optional: auto-reply for demo
      // selectedUser.value.messages.push({ from: selectedUser.value.name, text: "Got it!", timestamp: Date.now() });
    }, 1500);
  }
}

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
}

function closeChatOnMobile() {
  selectedUser.value = null;
}

// --- Time Formatting ---
function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

// --- Responsive Handling ---
function handleResize() {
  if (!isMobileView.value && selectedUser.value) {
    // Ensure chat stays open on desktop
  }
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

// Auto-focus input on mobile when chat opens
watch(selectedUser, (newVal) => {
  if (newVal && isMobileView.value && messageInput.value) {
    setTimeout(() => messageInput.value.focus(), 300);
  }
});
</script>

<style scoped>
.messages-section {
  padding: 1rem;
  font-family: "Poppins", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e40af;
  text-align: center;
  margin-bottom: 0.4rem;
}

.subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

/* CHAT CONTAINER */
.chat-container {
  display: flex;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  min-height: 500px;
  height: calc(100vh - 220px);
  flex-direction: column;
}

@media (min-width: 768px) {
  .chat-container {
    flex-direction: row;
    height: 600px;
  }
}

/* SEARCH */
.search-bar {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #dbe1f1;
  background: #f8fafc;
}

.search-bar input {
  width: 100%;
  padding: 0.6rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
}

/* USERS LIST */
.chat-list {
  width: 100%;
  background: #f1f5ff;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .chat-list {
    width: 35%;
    max-width: 320px;
    border-right: 1px solid #dbe1f1;
  }
}

.chat-list.mobile-hidden {
  position: absolute;
  left: -100%;
}

.chat-users {
  flex: 1;
  overflow-y: auto;
}

.chat-user {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: 0.2s;
  border-bottom: 1px solid #e5e9f5;
  position: relative;
}

.chat-user:hover {
  background: #e3ecff;
}

.chat-user.active {
  background: #1d4ed8;
  color: white;
}

.chat-user.active .last-message,
.chat-user.active .user-name {
  color: white;
}

/* Avatar */
.avatar {
  width: 42px;
  height: 42px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 12px;
  flex-shrink: 0;
  font-weight: 600;
}

.avatar.big {
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
}

.online-dot {
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  position: absolute;
  bottom: 2px;
  right: 2px;
}

.online-dot.offline {
  background: #cbd5e1;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-message {
  font-size: 0.82rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.empty-list {
  padding: 1.5rem;
  text-align: center;
  color: #94a3b8;
}

/* CHAT BOX */
.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-box.mobile-full {
  position: relative;
  z-index: 10;
  background: white;
}

/* Mobile Back Button */
.mobile-back-btn {
  display: none;
  padding: 0.8rem 1rem;
  background: #f1f5f9;
  border: none;
  font-weight: 600;
  color: #1d4ed8;
  cursor: pointer;
  border-bottom: 1px solid #dbe1f1;
}

@media (max-width: 767px) {
  .mobile-back-btn {
    display: block;
  }
}

/* Chat Header */
.chat-header {
  padding: 1rem;
  background: #f7f9ff;
  border-bottom: 1px solid #dbe1f1;
  display: flex;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-text {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

/* Messages */
.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 80%;
  padding: 0.75rem 1rem;
  margin-bottom: 12px;
  border-radius: 16px;
  position: relative;
  animation: fadeIn 0.2s ease;
  word-break: break-word;
}

.sent {
  background: #2563eb;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.received {
  background: #e2e8f0;
  color: #111;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.msg-time {
  font-size: 0.7rem;
  opacity: 0.8;
  display: block;
  margin-top: 4px;
  text-align: right;
}

.received .msg-time {
  text-align: left;
}

.read-indicator {
  font-size: 0.8rem;
  margin-left: 4px;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  padding: 0.5rem 1rem;
  align-self: flex-start;
  background: #e2e8f0;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  margin-bottom: 12px;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background: #94a3b8;
  margin: 0 2px;
  border-radius: 50%;
  animation: bounce 1.3s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Input */
.chat-input {
  display: flex;
  padding: 0.8rem;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  gap: 0.6rem;
}

.chat-input input {
  flex: 1;
  padding: 0.65rem 1rem;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
}

.chat-input input:focus {
  border-color: #3b82f6;
}

.chat-input button {
  background: #2563eb;
  color: white;
  padding: 0.65rem 1.2rem;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s;
}

.chat-input button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.chat-input button:hover:not(:disabled) {
  background: #1e4acb;
}

/* Placeholder */
.chat-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #909db6;
  padding: 1rem;
  line-height: 1.5;
}

.hint {
  font-size: 0.85rem;
  margin-top: 0.5rem;
  color: #a0aec0;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>