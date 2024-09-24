<template>
  <div class="chat-list">
    <div
      v-for="chatRoom in chatRoomList"
      :key="chatRoom.id"
      class="chat-item"
      @click="goToChatRoom(chatRoom.chatRoomId)"
    >
      <div class="chat-title">{{ chatRoom }}</div>
      <div class="chat-preview">{{ chatRoom.participants[0].userName }}</div>
      <!-- <div class="chat-preview">{{ chat.lastTime }}</div> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      chatRoomList: [],
    };
  },

  mounted() {
    this.fetchMessages();
  },
  methods: {
    async fetchMessages() {
      this.token = localStorage.getItem("token"); // 로컬스토리지에서 토큰을 가져옴

      if (this.token) {
        // 토큰이 존재하는 경우, Axios의 Authorization 헤더에 토큰을 추가
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      try {
        const response = await axios.get(`/api/chatroom/chatList`);
        this.chatRoomList = response.data;
        console.log("ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ", this.chatRoomList);
      } catch (error) {
        console.error("채팅방 목록 불러오기 실패", error);
      }
    },

    goToChatRoom(chatRoomId) {
      this.$router.push({ name: "ChatRoom", params: { chatRoomId } });
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
