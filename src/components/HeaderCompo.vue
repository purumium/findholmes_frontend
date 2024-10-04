<template>
  <div class="header-container">
    <nav class="header-nav">
      <div class="navbar-left">
        <router-link :to="isRole === 'ROLE_ADMIN' ? '/admin' : '/'">
          <div class="navbar-left-logo">
            <img src="/images/logoforhome.png" width="40px" />
            <span class="title">
              {{
                isRole === "ROLE_ADMIN" ? "HOLMES'S ADMIN PAGE" : "FINDMYHOLMES"
              }}</span
            >
          </div>
        </router-link>
      </div>
      <div class="navbar-right">
        <div v-if="!isAuthenticated" class="icon-container">
          <div
            class="icon-wrapper"
            @mouseover="tooltipText = '로그인'"
            @mouseleave="tooltipText = ''"
          >
            <router-link to="/login" active-class="active">
              <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="icon" />
            </router-link>
            <span v-if="tooltipText === '로그인'" class="tooltip">로그인</span>
          </div>

          <div
            class="icon-wrapper"
            @mouseover="tooltipText = '회원가입'"
            @mouseleave="tooltipText = ''"
          >
            <router-link to="/register" active-class="active">
              <font-awesome-icon :icon="['fas', 'user-plus']" class="icon" />
            </router-link>
            <span v-if="tooltipText === '회원가입'" class="tooltip"
              >회원가입</span
            >
          </div>
        </div>

        <!-- 로그인 후 admin -->
        <div v-else-if="isRole === 'ROLE_ADMIN'" class="icon-container">
          <div
            class="icon-wrapper"
            @click="handleLogout"
            @mouseover="tooltipText = '로그아웃'"
            @mouseleave="tooltipText = ''"
          >
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="icon" />
            <span v-if="tooltipText === '로그아웃'" class="tooltip"
              >로그아웃</span
            >
          </div>
        </div>

        <!-- 로그인 후 user -->
        <div v-else-if="isRole === 'ROLE_USER'" class="icon-container">
          <div
            class="icon-wrapper"
            @mouseover="tooltipText = '채팅'"
            @mouseleave="tooltipText = ''"
          >
            <router-link to="/chat" active-class="active">
              <font-awesome-icon :icon="['fas', 'comment-dots']" class="icon" />
            </router-link>
            <span v-if="tooltipText === '채팅'" class="tooltip">채팅</span>
            <span class="notification-num" v-if="chatCount > 0"
              >{{ chatCount }}
            </span>
          </div>

          <div
            class="icon-wrapper"
            @mouseover="tooltipText = '알림'"
            @mouseleave="tooltipText = ''"
            @click="moveToNotification"
          >
            <font-awesome-icon :icon="['fas', 'bell']" class="icon" />
            <span v-if="tooltipText === '알림'" class="tooltip">알림</span>
            <span
              class="notification-num"
              v-if="notificationCount + events.length > 0"
              >{{ notificationCount + events.length }}
            </span>
          </div>

          <div
            class="icon-wrapper"
            @click="handleLogout"
            @mouseover="tooltipText = '로그아웃'"
            @mouseleave="tooltipText = ''"
          >
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="icon" />
            <span v-if="tooltipText === '로그아웃'" class="tooltip"
              >로그아웃</span
            >
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters, useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { ref } from "vue";
import axios from "axios";

export default {
  data() {
    return {
      events: ref([]),
      notificationCount: 0,
      chatCount: 0,
    };
  },
  created() {
    this.loadNotificationCount();
  },
  mounted() {
    this.setUpEventSource();
  },
  computed: {
    ...mapGetters(["getId"]),
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const tooltipText = ref(""); // 툴팁 텍스트

    // Vuex에서 로그인 상태를 가져오기
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const isUser = computed(() => store.getters.getId);
    const isRole = computed(() => store.getters.getRoles);
    console.log(store.getters.getUser);
    // 로그아웃 처리 함수
    const handleLogout = async () => {
      await store.dispatch("logout"); // Vuex의 logout 액션 호출
      console.log(store.state);
      router.push("/login"); // 로그아웃 후 로그인 페이지로 리디렉션 (원하는 페이지로 변경 가능)
    };
    console.log(
      "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
      isAuthenticated.value,
      isUser
    );

    return {
      isAuthenticated,
      tooltipText,
      handleLogout,
      isRole,
    };
  },
  methods: {
    async loadNotificationCount() {
      try {
        const response = await axios.get("/api/notification/receive", {
          params: { userId: this.getId },
        });
        this.notificationCount = response.data;
      } catch (error) {
        console.log("미확인 알림 에러");
      }
    },
    setUpEventSource() {
      console.log("SSE연결전 : ", this.getId);
      const eventSource = new EventSource(
        `http://localhost:8080/notification/subscribe?userId=${this.getId}`
      );
      eventSource.onmessage = (event) => this.handleEvent(event);

      eventSource.addEventListener("addMessage", (event) => {
        console.log("addMessage 이벤트 수신: ", event.data);
        this.handleEvent(event);
      });

      eventSource.addEventListener("ReceiveChat", (event) => {
        console.log("채팅 카운트 알림 실행됨", event);
        this.chatCount += 1;
      });

      eventSource.onerror = this.handleConnectionError;
      eventSource.onopen = this.handleConnectionOpen;
      console.log("SSE연결후", eventSource);
    },
    handleEvent(event) {
      const eventData = JSON.parse(event.data);
      this.events.push(eventData);
      this.showNotification(eventData.message);
    },
    handleConnectionOpen() {
      console.log("연결에 성공하였습니다.");
    },
    hadleConnectionError(error) {
      console.error("연결 중 에러가 발생하였습니다.", error);
    },
    showNotification(message) {
      console.log(message);
    },
    moveToNotification() {
      (this.events = ref([])),
        (this.notificationCount = 0),
        this.$router.push("/notification");
    },
  },
};
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 20px 25px;
}

.navbar-left a {
  text-decoration: none;
  color: rgb(55, 48, 48);
}

.navbar-left-logo {
  display: flex;
  align-items: end;
}

.title {
  margin-left: 6px;
  font-size: 20px;
  letter-spacing: -1px;
  font-weight: 600;
  font-family: fangsong;
}

.icon-container {
  display: flex;
  gap: 25px;
  position: relative;
}

.icon-wrapper {
  position: relative;
}

.icon {
  font-size: 25px;
  cursor: pointer;
  color: rgb(0 0 0 / 32%);
}

.icon:hover {
  color: #191817; /* 호버 시 아이콘 색상 변경 */
}

/* Active 상태에서 아이콘 색상을 변경 */
.active .icon {
  color: #191817; /* 클릭 시 활성화된 아이콘 색상 */
}

/* 툴팁 스타일 */
.tooltip {
  position: absolute;
  bottom: -38px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 10px;
  background-color: white;
  border: 1px solid rgb(0 0 0 / 41%);
  border-radius: 10px;
  font-size: 10px;
  color: rgb(0 0 0 / 41%);
  white-space: nowrap;
  z-index: 10;
}

/* 작은 화면 (태블릿 이하) 레이아웃 조정 */
@media screen and (max-width: 768px) {
  .header-nav {
    margin: 0px 25px 0 16px;
  }

  .title {
    margin-left: 3px;
    font-size: 15px;
    letter-spacing: -1px;
    font-weight: 600;
  }

  .icon {
    font-size: 25px; /* 아이콘 크기 줄이기 */
  }

  .icon-container {
    gap: 22px;
  }

  .tooltip {
    font-size: 9px;
    bottom: -35px;
  }
}

.notification-num {
  background-color: rgb(252, 48, 48);
  width: auto;
  min-width: 16px;
  height: auto;
  min-height: 16px;
  padding: 5%;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 15px;
  position: absolute;
  left: 10px;
  bottom: 15px;
}

/* 더 작은 화면 (모바일) 레이아웃 조정 */
@media screen and (max-width: 480px) {
  .title {
    font-size: 15px; /* 타이틀 크기를 더 줄임 */
  }

  .icon {
    font-size: 22px; /* 모바일에 맞게 아이콘 크기 조정 */
  }

  .icon-container {
    gap: 20px;
  }

  .tooltip {
    font-size: 8px;
    bottom: -32px;
  }
}
</style>
