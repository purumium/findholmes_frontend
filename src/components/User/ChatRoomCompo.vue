<template>
  <div class="chat-room">
    <div class="chat-header">
      <h2>{{ chat.title }}</h2>
    </div>
    <div class="chat-messages">
      <div
        v-for="message in chat.messages"
        :key="message.id"
        class="message-item"
      >
        <div class="message-text">{{ message.text }}</div>
        <div class="message-time">{{ message.time }}</div>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="newMessage" placeholder="Type a message" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["chatId"],
  data() {
    return {
      chat: null,
      newMessage: "",
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage) {
        const newMsg = {
          id: Date.now(),
          text: this.newMessage,
          time: new Date().toLocaleTimeString(),
        };
        this.chat.messages.push(newMsg);
        this.newMessage = "";
      }
    },
    getChatById(chatId) {
      const chats = [
        {
          id: 1,
          title: "Danggeun Pay",
          messages: [{ id: 1, text: "Hello", time: "8:15 PM" }],
        },
        {
          id: 2,
          title: "Danggeun Alba",
          messages: [{ id: 1, text: "How are you?", time: "8:15 PM" }],
        },
        {
          id: 3,
          title: "Seoyeon Dad",
          messages: [
            { id: 1, text: "I will be there on Saturday!", time: "8:15 PM" },
          ],
        },
        // More chat data...
      ];
      return chats.find((chat) => chat.id === parseInt(chatId));
    },
  },
  mounted() {
    const chatId = this.$route.params.chatId;
    console.log("Chat ID:", chatId);
  },
  created() {
    const chatId = this.$route.params.chatId;
    this.chat = this.getChatById(chatId);
  },
};
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-header {
  padding: 10px;
  background-color: #f5f5f5;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message-item {
  margin-bottom: 10px;
}

.message-text {
  background-color: #e1e1e1;
  padding: 10px;
  border-radius: 5px;
}

.message-time {
  font-size: 0.8em;
  color: gray;
  text-align: right;
}

.chat-input {
  display: flex;
  padding: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.chat-input button {
  padding: 10px;
}
</style>
