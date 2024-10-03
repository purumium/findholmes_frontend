<template>
  <div class="estimate-container">
    <header class="estimate-top-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>채팅</h2>
      <span class="header-span">홈즈와 채팅하기</span>
    </header>
    <div class="chat-list">
      <div
        v-for="chatRoom in chatRoomList"
        :key="chatRoom.id"
        class="chat-item"
        @click="goToChatRoom(chatRoom.chatRoomId)"
      >
        <div class="chat-details">
          <div class="chat-title">
            <span class="name-tag">홈즈</span>
            <span>{{ chatRoom.participants[0].userName }}</span>
          </div>
          <div class="chat-preview">
            <!-- 마지막 메시지가 있을 경우 -->
            <span
              v-if="
                chatRoom.lastMessage !== null && chatRoom.lastMessage !== ''
              "
            >
              {{ chatRoom.lastMessage }}
            </span>

            <!-- 마지막 메시지가 없을 경우 -->
            <span v-else> 대화내용이 없습니다 </span>
          </div>
        </div>
        <div class="chat-info">
          <div class="chat-time">
            {{ timeconvert(chatRoom.lastChatTime) }}
          </div>
          <div class="chat-noti" v-if="chatRoom.notificationCount > 0">
            {{ chatRoom.notificationCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Stomp from "webstomp-client";
import SockJS from "sockjs-client";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
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
      chatRoomList: [],
    };
  },

  mounted() {
    this.fetchMessages();
    this.connect();
  },

  unmounted() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log("소켓 연결이 종료됨");
      });
    }
    console.log("페이지가 변경되었습니다.");
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
    timeconvert(time) {
      const converttime = new Date(time);
      const year = converttime.getFullYear();
      const month = String(converttime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(converttime.getDate()).padStart(2, "0");
      const hour = String(converttime.getHours()).padStart(2, "0");
      const minute = String(converttime.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
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

          // 사용자별 알림 구독 경로 설정 (알림 수신)
          this.stompClient.subscribe(
            `/user/${this.userId.toString()}/notifications`,
            (notification) => {
              const notificationData = JSON.parse(notification.body);
              const notificationCount = notificationData.notification; // 알림 개수 추출
              console.log("나야 채팅알림 수", notificationCount);
              const chatRoomId = notificationData.chatRoomId; // 해당 채팅방 ID 추출

              // chatRoomList를 map으로 순회하면서 해당 채팅방의 notificationCount 업데이트
              this.chatRoomList = this.chatRoomList.map((chatRoom) => {
                if (chatRoom.chatRoomId === chatRoomId) {
                  return {
                    ...chatRoom,
                    notificationCount: notificationCount, // 알림 개수 업데이트
                  };
                }
                return chatRoom; // 나머지는 그대로 유지
              });
            }
          );
        },
        (error) => {
          // 소켓 연결 실패
          console.log("소켓 연결 실패", error);
          this.connected = false;
        }
      );
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
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.chat-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chat-title {
  font-weight: bold;
  font-size: 17px;
  display: flex;
  align-items: center;
}

.name-tag {
  border: 1px solid #ffdf3e99;
  padding: 3px 7px;
  border-radius: 12px;
  color: #534c4c;
  background-color: #ffdf3e99;
  font-size: 10px;
  font-weight: 600;
  margin-right: 5px;
}

.chat-preview {
  color: #808080cc;
  margin-top: 5px;
  font-size: 14px;
}

.chat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.chat-time {
  color: #808080cc;
  font-size: 13px;
  margin-bottom: 5px;
  white-space: nowrap;
}

.chat-noti {
  background-color: #ff5252;
  color: white;
  font-weight: bold;
  font-size: 12px;
  border-radius: 50%;
  padding: 5px 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
}
</style>
