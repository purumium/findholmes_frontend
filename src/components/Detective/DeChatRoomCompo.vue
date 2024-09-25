<template>
  <div>
    <div v-if="hasAccess">
      <!-- 개인정보 동의 모달 -->
      <div v-if="showAcceptedPrivacyModal" class="modal">
        <div class="modal-content">
          <div>
            <h4>🚨 안내 메시지 🚨</h4>
            <p>
              ⭐ 개인정보 보호를 위해
              <strong>주소, 휴대폰번호, 계좌번호 등의 개인 정보</strong>를 절대
              주고받지 마세요.
            </p>
            <p>
              ⭐ 개인정보 유출 시 발생하는 문제에 대해
              <strong>찾아줘홈즈'는 책임을 지지 않습니다</strong>
            </p>
            <p>⭐ 안전한 채팅을 위해 협조 부탁드립니다. 감사합니다!</p>
          </div>
          <div class="btn-group">
            <button @click="acceptPrivacy">동의</button>
            <button @click="declinePrivacy">취소</button>
          </div>
        </div>
      </div>

      <div class="chat-room">
        <header class="estimate-top-header" @click="goBack">
          <button class="back-button">&lt;</button>
          <h2>채팅</h2>
          <span class="header-span">의뢰인과 채팅하기</span>
        </header>

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
            <div class="message-time">{{ timeconvert(item.sendTime) }}</div>
          </div>
        </div>
        <div class="chat-input">
          <input
            v-model="message"
            type="text"
            placeholder="메세지를 작성하세요."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">보내기</button>
        </div>
      </div>
    </div>
    <div v-else-if="!hasAccess">
      <!-- 권한이 없을 때 -->
      <p>채팅방에 접근할 권한이 없습니다.</p>
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
      hasAccess: false,
      showAcceptedPrivacyModal: false,
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
    console.log("User ID: ", this.userId);
    this.showConsentModal = true;
  },

  computed: {
    chatRoomId() {
      return this.$route.params.chatRoomId; // route params에서 chatRoomId 가져옴
    },
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },
    sendMessage() {
      if (this.message !== "") {
        this.send();
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
      this.token = localStorage.getItem("token"); // 로컬스토리지에서 토큰을 가져옴

      if (this.token) {
        // 토큰이 존재하는 경우, Axios의 Authorization 헤더에 토큰을 추가
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      try {
        // 백엔드로 권한 검증 요청
        await axios.get(`/api/chatroom/${this.chatRoomId}/check-access`);
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
      this.token = localStorage.getItem("token"); // 로컬스토리지에서 토큰을 가져옴

      if (this.token) {
        // 토큰이 존재하는 경우, Axios의 Authorization 헤더에 토큰을 추가
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
      this.token = localStorage.getItem("token"); // 로컬스토리지에서 토큰을 가져옴

      if (this.token) {
        // 토큰이 존재하는 경우, Axios의 Authorization 헤더에 토큰을 추가
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

        this.senderId = this.chatRoom.participants[1].userId;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 350px;
  height: 260px;
}

.chat-room {
  display: flex;
  flex-direction: column;
  height: 81vh;
}

/* .chat-header {
  padding: 10px;
  background-color: #f5f5f5;
}
*/

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

h4 {
  text-align: center;
  font-size: 15px;
  padding: 7px 0;
  background-color: #f7f28457;
}

p {
  font-size: 13px;
  margin: 20px 7px;
}

.btn-group {
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-top: 22px;
}

button {
  padding: 6px 30px;
  background-color: #ffdf3e9c;
  border: none;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
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
  background-color: #ffdf3e5e;
  color: black;
  padding: 10px;
  font-size: 14px;
  border-radius: 10px 10px 0 10px;
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
  padding: 18px;
  background-color: #f5f5f5;
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
  font-weight: 600;
  background-color: #ffdf3ef7;
  color: #0a0404;
  border: none;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #ffdf3ef7;
}
</style>
