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
            <button @click="acceptPrivacy" class="modal-button">동의</button>
            <button @click="declinePrivacy" class="modal-button">취소</button>
          </div>
        </div>
      </div>

      <div class="chat-room">
        <header class="estimate-top-header" @click="goBack">
          <button class="back-button">&lt;</button>
          <h2>채팅</h2>
          <span class="header-span">홈즈와 채팅하기</span>
        </header>

        <header class="estimate-info">
          <div class="icon-area">
            <div class="icon-placeholder">
              <img src="/images/estimate.png" width="25px" />
            </div>
          </div>
          <div class="estimate-info-text">
            <div class="estimate-title">
              [{{ this.speciality }}] <strong>{{ this.e_title }}</strong>
              <span class="tag">답변서</span>
            </div>
            <div class="estimate-price">
              {{
                this.e_price !== undefined
                  ? this.e_price.toLocaleString()
                  : "0"
              }}원
            </div>
          </div>
        </header>

        <div ref="chatMessages" class="chat-messages">
          <div
            v-for="(item, idx) in recvList"
            :key="idx"
            class="message-container"
          >
            <div v-if="showDateHeader(idx)" class="date-wrapper">
              <div class="date-header">
                {{ formatDate(item.sendTime) }}
              </div>
            </div>
            <div
              :class="{
                'my-message': item.senderId === this.senderId,
                'my-message-item': item.senderId === this.senderId,
                'other-message': item.senderId !== this.senderId,
                'other-message-item': item.senderId !== this.senderId,
              }"
            >
              <div class="message-read">
                <div
                  class="message-isRead"
                  v-if="item.senderId === this.senderId"
                >
                  {{ item.readCount === 2 ? "" : "1" }}
                </div>
                <div class="message-time">{{ timeconvert(item.sendTime) }}</div>
              </div>
              <div class="message-text">{{ item.message }}</div>
            </div>
          </div>
        </div>
        <div v-if="!canSend" class="point-buttons">
          <button v-if="currentPoints >= 1000" @click="payPoints">
            계속 채팅을 원하는 경우, 1000 포인트 사용
          </button>
          <button v-else @click="chargePoints">포인트 충전하러 가기</button>
        </div>
        <div class="chat-input">
          <textarea
            v-model="message"
            :placeholder="
              canSend
                ? '메세지를 작성하세요.'
                : '채팅 한도 5회를 초과하였습니다.'
            "
            @input="autoResize"
            @keyup.enter="sendMessage"
            :disabled="!canSend"
            rows="1"
          ></textarea>
          <button @click="sendMessage" :disabled="!canSend">보내기</button>
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
import Swal from "sweetalert2";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  props: ["chatRoomId"],

  setup() {
    const store = useStore();
    const userId = computed(() => store.getters.getId);

    onMounted(() => {
      console.log("Computed userId:", userId.value);
    });
    return {
      userId,
    };
  },
  data() {
    return {
      hasAccess: false,
      showAcceptedPrivacyModal: false,
      canSend: null,
      currentPoints: 0,
      // userName: "",
      senderId: null,
      message: "",
      recvList: [],
    };
  },

  // computed: {
  //   chatRoomId() {
  //     return this.$route.params.chatRoomId; // route params에서 chatRoomId 가져옴
  //   },
  // },

  mounted() {
    console.log("Chat Room ID", this.chatRoomId);
    this.checkAccess();
    this.checkAcceptedPrivacy();
    this.connect();
    this.fetchChatRoomData();
    this.showConsentModal = true;
    this.checkCanSendMessage();
    this.getCurrentPoints();
  },

  unmounted() {
    console.log("페이지가 변경되었습니다.");
  },
  updated() {
    this.receiveChatCount();
  },
  created() {
    //this.receiveChatCount();
    alert(this.chatRoomId);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async receiveChatCount() {
      try {
        axios.get("http://3.35.185.10:8080/notification/chatCount", {
          params: { userId: this.userId },
        });
      } catch (error) {
        return;
      }
    },
    async checkCanSendMessage() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      const response = await axios.get(
        "http://3.35.185.10:8080/chatroom/${this.chatRoomId}/can-send-message`
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
        await axios.post("http://3.35.185.10:8080/chatroom/${this.chatRoomId}/increase-count`);
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
        this.$nextTick(() => {
          const textarea = this.$el.querySelector("textarea");
          textarea.style.height = "20px"; // 초기 높이로 재설정
        });
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
          isRead: false,
        };
        this.stompClient.send("/receive", JSON.stringify(msg), {});
      }
    },
    connect() {
      const serverURL = "http://3.35.185.10:8080/ws";
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
          this.stompClient.subscribe(`/send/${this.chatRoomId}`, (res) => {
            console.log("구독으로 받은 메시지 입니다.", res.body);
            const newMessage = JSON.parse(res.body);
            // 받은 데이터를 json으로 파싱하고 리스트에 넣어줍니다.
            this.recvList.push(newMessage);

            // 상대방이 보낸 메시지일 경우 읽음 처리
            if (newMessage.senderId !== this.senderId) {
              console.log("상대방이 보낸 메시지입니다. 읽음 처리 중...");
              this.sendReadReceipt(); // 메시지 읽음 처리
            }

            this.scrollToBottom();
          });

          // 새 코드 부분임

          // 상대방이 내 메시지를 읽었을 때 알림을 받음
          this.stompClient.subscribe(
            `/topic/chat/${this.chatRoomId}`,
            (res) => {
              console.log("읽음으로 받은 메시지", res.body);
              const newMessage = JSON.parse(res.body);
              // 메시지가 내가 보낸 것이 아닌 경우 처리
              // if (this.senderId !== newMessage.senderId) {
              // 메시지가 모두 읽힌 경우 readCount는 2가 됨
              this.recvList = this.recvList.map((msg) => {
                return {
                  ...msg,
                  readCount: newMessage.readCount, // 새로 받은 readCount로 업데이트
                };
              });
              if (newMessage.readCount === 2) {
                console.log("상대방이 메시지를 읽었습니다.");
                // 읽음 표시 관련 UI 업데이트
              }
            }
          );
          this.sendReadReceipt();
        },
        (error) => {
          // 소켓 연결 실패
          console.log("소켓 연결 실패", error);
          this.connected = false;
        }
      );
    },

    sendReadReceipt() {
      const readInfo = {
        chatRoomId: this.chatRoomId,
        userId: this.userId, // 현재 사용자의 ID를 포함
      };
      console.log("~~~~~~~~~~~~~~~~~~~~~", JSON.stringify(readInfo));

      // 서버로 메시지가 읽혔음을 알림
      this.stompClient.send(
        `/read/${this.chatRoomId}`,
        JSON.stringify(readInfo),
        {} // 단일 객체를 JSON으로 변환해 전송
      );

      // this.stompClient.send("/receive", JSON.stringify(msg), {});
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
        await axios.get("http://3.35.185.10:8080/chatroom/${this.chatRoomId}/check-access`);
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
          "http://3.35.185.10:8080/chatroom/${this.chatRoomId}/check-isaccepted`
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
        await axios.post("http://3.35.185.10:8080/chatroom/${this.chatRoomId}/is-accepted`);
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
          "http://3.35.185.10:8080/chatroom/${this.chatRoomId}/unlimitedChat`,
          null,
          {
            params: {
              points: 1000, // 고정된 1000 포인트 차감
            },
          }
        );
        Swal.fire({
          title: response.data,
          text: "무제한으로 채팅 이용가능합니다!",
          icon: "success",
          confirmButtonText: "확인",
        });
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
        const response = await axios.get("http://3.35.185.10:8080/client/current-point`);
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
          "http://3.35.185.10:8080/chatroom/detail/${this.chatRoomId}`
        );
        this.chatRoom = response.data;
        console.log("chatRoom 정보: ", this.chatRoom);

        this.senderId = this.chatRoom.participants[0].userId;
        this.client = this.chatRoom.participants[1].userName;
        this.e_title = this.chatRoom.estimate_title;
        this.e_price = this.chatRoom.estimate_price;
        this.speciality = this.chatRoom.requestSpeciality.specialityName;
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
          "http://3.35.185.10:8080/chat/chatroom/${this.chatRoomId}`
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
      // const year = converttime.getFullYear();
      // const month = String(converttime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      // const day = String(converttime.getDate()).padStart(2, "0");
      const hour = String(converttime.getHours()).padStart(2, "0");
      const minute = String(converttime.getMinutes()).padStart(2, "0");
      // return `${year}-${month}-${day} ${hour}:${minute}`;
      return `${hour}:${minute}`;
    },
    formatDate(datetime) {
      const date = new Date(datetime);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      };
      return date.toLocaleDateString("ko-KR", options); // 한국어 형식으로 변환
    },
    showDateHeader(idx) {
      if (idx === 0) return true;
      const currentDate = new Date(this.recvList[idx].sendTime).toDateString();
      const previousDate = new Date(
        this.recvList[idx - 1].sendTime
      ).toDateString();
      return currentDate !== previousDate;
    },
    autoResize(event) {
      const textarea = event.target;
      const padding =
        parseInt(window.getComputedStyle(textarea).paddingTop) +
        parseInt(window.getComputedStyle(textarea).paddingBottom);
      textarea.style.height = "auto"; // 높이 초기화
      textarea.style.height = textarea.scrollHeight - padding + "px"; // 패딩을 제외한 높이 설정
    },
  },
  beforeUnmount() {
    // 컴포넌트가 사라지기 전에 WebSocket 연결 해제
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log("WebSocket disconnected");
      });
    }
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
  height: 83vh;
}

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

.point-buttons {
  text-align: center;
  margin-bottom: 35px;
}

.point-buttons button {
  padding: 9px 22px;
  background-color: #ababab7a;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 600;
  position: relative;
  top: 15px;
}

.modal-button {
  padding: 6px 30px;
  background-color: #ffdf3e9c;
  border: none;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
}

.estimate-info {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
}

.icon-area {
  margin-right: 15px;
}

.icon-placeholder {
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 12px;
  color: #888;
}

.tag {
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 3px 5px;
  border-radius: 20px;
  font-size: 11px;
  margin-left: 5px;
  font-weight: 600;
  cursor: pointer;
}

.estimate-info-text {
  display: flex;
  flex-direction: column;
}

.estimate-title strong {
  margin-left: 5px;
  color: #000;
}

.estimate-title {
  color: #000000b3;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.estimate-price {
  color: #808080;
  font-size: 14px;
  margin-top: 5px;
}

/* 날짜 중앙 정렬 */
.date-wrapper {
  display: flex;
  justify-content: center; /* 날짜를 수평으로 중앙에 정렬 */
  margin: 20px 0; /* 위아래 간격 */
  width: 100%; /* 부모 요소의 전체 너비 차지 */
}

.date-header {
  background-color: #e7ebedd7; /* 배경색 */
  border-radius: 20px; /* 둥근 모서리 */
  padding: 12px 18px; /* 안쪽 여백 */
  font-size: 0.8rem;
  color: #666; /* 텍스트 색상 */
  font-weight: normal; /* 텍스트 굵기 */
  text-align: center; /* 텍스트 중앙 정렬 */
}

/* 공통 메시지 스타일 */
.message-container {
  width: 100%; /* 부모 컨테이너의 전체 너비를 차지 */
  display: block; /* 메시지가 중앙에 정렬되지 않도록 block으로 설정 */
}

/* 내 메시지 (오른쪽 배치) */
.my-message-item {
  display: flex;
  flex-direction: row;
  gap: 6px;
  max-width: 60%;
  clear: both;
}

.my-message {
  float: right;
  text-align: left;
}

.my-message .message-read {
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 0px;
  align-items: end;
  padding-bottom: 11px;
}

.my-message .message-text {
  background-color: #ffdf3e5e;
  color: black;
  padding: 14px;
  border-radius: 20px 20px 0 20px;
  margin-block: 10px;
}

.message-isRead {
  font-size: 13px;
}

.message-read .message-time {
  font-size: 12px;
  color: #808080b3;
}

/* 상대 메시지 (왼쪽 배치) */
.other-message-item {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row-reverse;
  align-items: end;
  gap: 6px;
  max-width: 60%;
  clear: both;
}

.other-message {
  float: left; /* 메시지를 왼쪽으로 정렬 */
  text-align: left;
}

.other-message .message-text {
  background-color: #f1f0f0;
  color: black;
  padding: 14px;
  border-radius: 20px 20px 20px 0;
}

.other-message .message-time {
  font-size: 12px;
  color: #808080b3;
}

.chat-input {
  display: flex;
  padding: 18px;
  background-color: #f5f5f5;
}

.chat-input textarea {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  overflow-y: auto;
  max-height: 150px;
  min-height: 20px;
}

.chat-input button {
  padding: 10px;
  border-radius: 5px;
  font-weight: 600;
  background-color: #ffdf3ef7;
  color: #0a0404;
  border: none;
  cursor: pointer;
  height: 40px;
  align-self: flex-end;
}

.chat-input button:hover {
  background-color: #ffdf3ef7;
}
</style>
