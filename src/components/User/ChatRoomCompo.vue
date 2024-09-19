<template>
  <div class="chat-room">
    <div class="chat-header"></div>
    <div class="chat-messages">
      <div v-for="(item, idx) in recvList" :key="idx" class="message-item">
        <div class="message-text">{{ item.message }}</div>
        <div class="message-time">{{ item.sendTime }}</div>
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="message"
        type="text"
        placeholder="메세지를 작성하세요."
        @keyup="sendMessage"
      />
      <!-- <button @click="sendMessage">보내기</button> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Stomp from "webstomp-client";
import SockJS from "sockjs-client";

export default {
  name: "App",
  data() {
    return {
      // userName: "",
      // chatRoomId: null,
      senderId: null,
      message: "",
      recvList: [],
    };
  },

  created() {
    this.connect();
  },

  mounted() {
    this.fetchChatRoomData();
    this.fetchMessages();

    console.log("Chat Room ID", this.chatRoomId);
    console.log("User ID: ", this.userId);
  },

  computed: {
    chatRoomId() {
      return this.$route.params.chatRoomId; // route params에서 chatRoomId 가져옴
    },
  },

  methods: {
    sendMessage(e) {
      if (e.keyCode === 13 && this.message !== "") {
        this.send();
        this.message = "";
      }
    },
    send() {
      console.log("Send message:" + this.message);
      if (this.stompClient && this.stompClient.connected) {
        const msg = {
          chatRoomId: this.chatRoomId,
          senderId: this.senderId,
          message: this.message,
          sendTime: new Date(),
        };
        this.stompClient.send("/receive", JSON.stringify(msg), {});
      }
    },
    connect() {
      const serverURL = "http://localhost:8080/ws";
      let socket = new SockJS(serverURL);
      this.stompClient = Stomp.over(socket);

      // 로컬스토리지에서 JWT 토큰을 가져옵니다.
      const token = localStorage.getItem("token"); // 로컬 스토리지에서 JWT 토큰을 가져옴
      console.log("소켓 연결을 시도합니다. 서버 주소: " + serverURL);

      this.stompClient.connect(
        { Authorization: `Bearer ${token}` },
        (frame) => {
          // 소켓 연결 성공
          this.connected = true;
          console.log("소켓 연결 성공", frame);
          // 서버의 메시지 전송 endpoint를 구독합니다.
          // 이런형태를 pub sub 구조라고 합니다.
          this.stompClient.subscribe("/send", (res) => {
            console.log("구독으로 받은 메시지 입니다.", res.body);

            // 받은 데이터를 json으로 파싱하고 리스트에 넣어줍니다.
            this.recvList.push(JSON.parse(res.body));
          });
        },
        (error) => {
          // 소켓 연결 실패
          console.log("소켓 연결 실패", error);
          this.connected = false;
        }
      );
    },

    async fetchChatRoomData() {
      this.token = localStorage.getItem("token"); // 로컬스토리지에서 토큰을 가져옴

      if (this.token) {
        // 토큰이 존재하는 경우, Axios의 Authorization 헤더에 토큰을 추가
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      try {
        const response = await axios.get(
          `/api/chatroom/detail/${this.chatRoomId}`
        );
        this.chatRoom = response.data;
        console.log("chatRoom 정보: ", this.chatRoom);

        this.senderId = this.chatRoom.participants[0].userId;
        console.log("Sender ID: ", this.senderId);
      } catch (error) {
        console.error("채팅방 정보 가져오는 중 오류 발생", error);
      }
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
        const response = await axios.get(
          `/api/chat/chatroom/${this.chatRoomId}`
        );
        // this.messages = response.data;
        this.recvList = response.data;
        console.log("ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ", this.recvList);
      } catch (error) {
        console.error("이전 메시지 불러오기 실패", error);
      }
    },
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
