<template>
  <div class="chat-list">
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
    goToChatRoom(chatId) {
      this.$router.push({ name: "ChatRoom", params: { chatId } });
    },
  },
};
</script>

<style scoped>
.chat-list {
  padding: 10px;
}

.chat-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.chat-title {
  font-weight: bold;
}

.chat-preview {
  color: gray;
}
</style>
