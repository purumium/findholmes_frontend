<template>
  <div class="estimate-container">
    <header class="estimate-top-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>채팅</h2>
      <span class="header-span">의뢰인과 채팅하기</span>
    </header>

    <div
      v-for="chatRoom in chatRoomList"
      :key="chatRoom.id"
      class="chat-item"
      @click="goToChatRoom(chatRoom.chatRoomId)"
    >
      <div>
        <div class="chat-title">
          <span class="name-tag">의뢰인</span>
          <span>{{ chatRoom.participants[0].userName }}</span>
        </div>
        <div class="chat-preview">
          <!-- 마지막 메시지가 있을 경우 -->
          <span
            v-if="chatRoom.lastMessage !== null && chatRoom.lastMessage !== ''"
          >
            {{ chatRoom.lastMessage }}
          </span>

          <!-- 마지막 메시지가 없을 경우 -->
          <span v-else> 대화내용이 없습니다 </span>
        </div>
      </div>
      <div class="chat-preview">{{ timeconvert(chatRoom.lastChatTime) }}</div>
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
    goBack() {
      this.$router.go(-1);
    },
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
      this.$router.push({ name: "DetectiveChatRoom", params: { chatRoomId } });
    },
    timeconvert(time) {
      const converttime = new Date(time);
      const year = converttime.getFullYear();
      const month = String(converttime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(converttime.getDate()).padStart(2, "0");
      const hour = String(converttime.getHours()).padStart(2, "0");
      const minute = String(converttime.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
  },
};
</script>

<style scoped>
.estimate-container {
  font-family: Arial, sans-serif;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
}

.estimate-top-header {
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

.header-span {
  color: #666;
  font-size: 12px;
  margin: 5px 0 0 5px;
}

/* .chat-list {
  padding: 0 10px;
} */

.chat-item {
  display: flex;
  justify-content: space-between;
  padding: 20px 20px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.chat-title {
  font-weight: bold;
  font-size: 17px;
  display: flex;
  align-items: center;
}

.chat-preview {
  color: #808080cc;
  margin-top: 10px;
  font-size: 14px;
}

.name-tag {
  border: 1px solid #ffdf3e99;
  padding: 3px 7px;
  border-radius: 20px;
  color: #534c4c;
  background-color: #ffdf3e99;
  font-size: 10px;
  font-weight: 600;
  margin-right: 5px;
}
</style>
