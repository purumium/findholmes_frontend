<template>
  <div class="chat-container">
    <header class="chat-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>채팅</h2>
      <span class="header-span"></span>
    </header>

    <div class="chat-contain">
      <div
        v-for="chat in chats"
        :key="chat.id"
        class="chat-item"
        @click="goToChatRoom(chat.id)"
      >
        <div class="chat-title">{{ chat.title }}</div>
        <div class="chat-preview">{{ chat.lastMessage }}</div>
        <div class="chat-preview">{{ chat.lastTime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chats: [
        {
          id: 1,
          title: "Danggeun Pay",
          lastMessage: "You need to confirm the payment",
          lastTime: "8:13 PM",
        },
        {
          id: 2,
          title: "Danggeun Alba",
          lastMessage: "Check the job offers on the home page",
          lastTime: "8:15 PM",
        },
        {
          id: 3,
          title: "Seoyeon Dad",
          lastMessage: "I will be there on Saturday!",
          lastTime: "9:15 PM",
        },
        // Add more chat data as per your need
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goToChatRoom(chatId) {
      this.$router.push({ name: "ChatRoom", params: { chatId } });
    },
  },
};
</script>

<style scoped>
.chat-container {
  font-family: Arial, sans-serif;
}

.chat-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #80808012;
}

.back-button {
  font-size: 21px;
  margin-left: 0px;
  padding: 8px 15px;
  background: none;
  border: none;
  cursor: pointer;
}

h2 {
  margin-left: -5px;
  font-size: 16px;
  font-weight: bold;
}

.chat-contain {
  margin: 0px;
}

.chat-item {
  display: flex;
  flex-direction: column;
  padding: 15px 10px 13px 18px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  gap: 5px;
}

.chat-title {
  font-weight: bold;
}

.chat-preview {
  color: gray;
}
</style>
