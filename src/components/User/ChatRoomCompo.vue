<template>
  <div v-if="hasAccess">
    <!-- 개인정보 동의 모달 -->
    <div v-if="showAcceptedPrivacyModal" class="modal">
      <div class="modal-content">
        <h3>개인정보 처리 방침 동의</h3>
        <p>채팅방에 입장하기 전에 개인정보 처리 방침에 동의해주세요.</p>
        <button @click="acceptPrivacy">동의</button>
        <button @click="declinePrivacy">취소</button>
      </div>
    </div>

    <div class="chat-room">
      <div class="chat-header">
        <!-- <h2>{{ chat.title }}</h2> -->
      </div>
      <div ref="chatMessages" class="chat-messages">
        <div
          v-for="(item, idx) in recvList"
          :key="idx"
          :class="{
            'my-message': item.senderId === this.senderId, // 내 메시지
            'other-message': item.senderId !== this.senderId, // 상대 메시지
          }"
          class="message-item"
        >
          <div class="message-text">{{ item.message }}</div>
          <div class="message-time">{{ item.sendTime }}</div>
        </div>
      </div>
      <div v-if="!canSend" class="point-buttons">
        <button v-if="currentPoints >= 1000" @click="payPoints">
          포인트 1000 사용
        </button>
        <button v-else @click="chargePoints">포인트 충전하러 가기</button>
      </div>
      <div class="chat-input">
        <input
          v-model="message"
          type="text"
          :placeholder="
            canSend ? '메세지를 작성하세요.' : '채팅 한도 5회를 초과하였습니다.'
          "
          @keyup.enter="sendMessage"
          :disabled="!canSend"
        />
        <button @click="sendMessage" :disabled="!canSend">보내기</button>
      </div>
    </div>
  </div>
  <div v-else-if="!hasAccess">
    <!-- 권한이 없을 때 -->
    <p>채팅방에 접근할 권한이 없습니다.</p>
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
      hasAccess: false,
      showAcceptedPrivacyModal: false,
      canSend: null,
      currentPoints: 0,
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
    console.log("Chat Room ID", this.chatRoomId);
    this.checkAccess();
    this.checkAcceptedPrivacy();
    this.fetchChatRoomData();
    this.showConsentModal = true;
    this.checkCanSendMessage();
    this.getCurrentPoints();
  },

  computed: {
    chatRoomId() {
      return this.$route.params.chatRoomId; // route params에서 chatRoomId 가져옴
    },
  },

  methods: {
    async checkCanSendMessage() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      const response = await axios.get(
        `/api/chatroom/${this.chatRoomId}/can-send-message`
      );
      this.canSend = response.data; // true or false를 받아서 canSend 상태에 저장
      console.log("dddddddddddddddddddddddddddddddddd", response.data);
    },

    async increaseMessageCount() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      try {
        await axios.post(`/api/chatroom/${this.chatRoomId}/increase-count`);
      } catch (error) {
        console.error("채팅 수 증가 실패:", error);
      }
    },

    sendMessage() {
      if (this.message !== "") {
        this.send();
        this.increaseMessageCount();
        this.checkCanSendMessage();
        this.message = "";
        this.scrollToBottom();
      }
    },
    send() {
      console.log("Send message:" + this.message);
      if (this.stompClient && this.stompClient.connected) {
        const msg = {
          chatRoomId: this.chatRoomId,
          senderId: this.senderId,
          message: this.message,
          sendTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
        };
        this.stompClient.send("/receive", JSON.stringify(msg), {});
      }
    },
    connect() {
      const serverURL = "http://localhost:8080/ws";
      let socket = new SockJS(serverURL);
      this.stompClient = Stomp.over(socket);

      const token = localStorage.getItem("token");
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
            this.scrollToBottom();
          });
        },
        (error) => {
          // 소켓 연결 실패
          console.log("소켓 연결 실패", error);
          this.connected = false;
        }
      );
    },

    async checkAccess() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      try {
        // 백엔드로 권한 검증 요청
        await axios.get(`/api/chatroom/${this.chatRoomId}/check-access`);
        console.log(this.chatRoomId);
        this.hasAccess = true; // 권한이 있으면 true로 설정
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // 권한이 없을 경우 처리
          this.hasAccess = false;
          alert("채팅방에 접근할 권한이 없습니다.");
          this.$router.push("/"); // 권한이 없을 때 다른 페이지로 리디렉션
        } else {
          console.error("서버 오류:", error);
        }
      }
    },

    // 개인정보 동의 확인
    async checkAcceptedPrivacy() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      try {
        const response = await axios.get(
          `/api/chatroom/${this.chatRoomId}/check-isaccepted`
        );
        if (response.data) {
          this.fetchMessages(); // 이미 동의했으면 채팅방 접근 검증
        } else {
          this.showAcceptedPrivacyModal = true; // 동의하지 않았으면 모달 표시
        }
      } catch (error) {
        console.error("개인정보 동의 상태 확인 실패:", error);
      }
    },

    // 개인정보 동의 처리
    async acceptPrivacy() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      try {
        await axios.post(`/api/chatroom/${this.chatRoomId}/is-accepted`);
        this.showAcceptedPrivacyModal = false; // 모달 닫기
      } catch (error) {
        console.error("개인정보 동의 처리 실패:", error);
      }
    },

    // 개인정보 동의를 거부한 경우
    declinePrivacy() {
      alert("개인정보 동의를 거부하셨습니다. 채팅방에 입장할 수 없습니다.");
      this.$router.push("/"); // 동의 거부 시 홈으로 리디렉션
    },

    async payPoints() {
      this.token = localStorage.getItem("token");
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      try {
        const response = await axios.post(
          `/api/chatroom/${this.chatRoomId}/unlimitedChat`,
          null,
          {
            params: {
              points: 1000, // 고정된 1000 포인트 차감
            },
          }
        );
        alert(response.data);
        this.checkCanSendMessage();
      } catch (error) {
        if (error.response) {
          alert(error.response.data); // 오류 메시지 알림으로 표시
        } else {
          alert("서버와의 통신에 문제가 발생했습니다.");
        }
      }
    },

    chargePoints() {
      this.$router.push("/payment");
    },

    async getCurrentPoints() {
      this.token = localStorage.getItem("token");
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      try {
        const response = await axios.get(`/api/client/current-point`);
        this.currentPoints = response.data;
      } catch (error) {
        console.error("포인트 정보 가져오기 실패", error);
      }
    },

    async fetchChatRoomData() {
      this.token = localStorage.getItem("token");

      if (this.token) {
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
      this.token = localStorage.getItem("token");

      if (this.token) {
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
        this.scrollToBottom();
        console.log("ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ", this.recvList);
      } catch (error) {
        console.error("이전 메시지 불러오기 실패", error);
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatMessagesDiv = this.$refs.chatMessages;
        if (chatMessagesDiv) {
          // null 체크
          chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
        }
      });
    },
  },
};
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
}

.chat-room {
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.chat-header {
  padding: 10px;
  background-color: #f5f5f5;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.chat-messages::-webkit-scrollbar {
  display: none;
}

/* 공통 메시지 스타일 */
.message-item {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

/* 내 메시지 (오른쪽 배치) */
.my-message {
  align-self: flex-end; /* 메시지를 오른쪽으로 정렬 */
  text-align: right;
}

.my-message .message-text {
  background-color: #d1f7c4; /* 내 메시지의 배경색 (연한 녹색) */
  color: black;
  padding: 10px;
  border-radius: 10px 10px 0 10px; /* 왼쪽 위만 둥글지 않게 */
}

/* 상대 메시지 (왼쪽 배치) */
.other-message {
  align-self: flex-start; /* 메시지를 왼쪽으로 정렬 */
  text-align: left;
}

.other-message .message-text {
  background-color: #f1f0f0; /* 상대 메시지의 배경색 (연한 회색) */
  color: black;
  padding: 10px;
  border-radius: 10px 10px 10px 0; /* 오른쪽 위만 둥글지 않게 */
}

/* 공통 메시지 시간 스타일 */
.message-time {
  font-size: 0.8em;
  color: gray;
  margin-top: 5px;
  text-align: right;
}

.chat-input {
  display: flex;
  padding: 10px;
  background-color: #f5f5f5;
  /* position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000; */
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
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #45a049;
}
</style>
