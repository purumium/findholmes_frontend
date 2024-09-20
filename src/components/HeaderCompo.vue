<template>
  <header>
    <nav class="header-nav">
      <div class="navbar-left">
        <router-link :to="isRole === 'ROLE_ADMIN' ? '/admin' : '/'">
          <div class="navbar-left-logo">
            <img src="/images/logoforhome.png" width="40px" />
            <span class="title">
              {{ isAdmin ? "HOLMES'S ADMIN PAGE" : "FINDMYHOLMES" }}</span
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
        <div v-dlse-if="isRole === 'ROLE_USER'" class="icon-container">
          <div
            class="icon-wrapper"
            @mouseover="tooltipText = '채팅'"
            @mouseleave="tooltipText = ''"
          >
            <router-link to="/chat" active-class="active">
              <font-awesome-icon :icon="['fas', 'comment-dots']" class="icon" />
            </router-link>
            <span v-if="tooltipText === '채팅'" class="tooltip">채팅</span>
          </div>

          <div
            class="icon-wrapper"
            @mouseover="tooltipText = '알림'"
            @mouseleave="tooltipText = ''"
          >
            <router-link to="/notification" active-class="active">
              <font-awesome-icon :icon="['fas', 'bell']" class="icon" />
            </router-link>
            <span v-if="tooltipText === '알림'" class="tooltip">알림</span>
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
  </header>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { ref } from "vue";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const tooltipText = ref(""); // 툴팁 텍스트

    // Vuex에서 로그인 상태를 가져오기
    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    const isRole = computed(() => store.getters.getRoles);

    // 로그아웃 처리 함수
    const handleLogout = async () => {
      await store.dispatch("logout"); // Vuex의 logout 액션 호출
      console.log(store.state);
      router.push("/login"); // 로그아웃 후 로그인 페이지로 리디렉션 (원하는 페이지로 변경 가능)
    };

    return {
      isAuthenticated,
      tooltipText,
      handleLogout,
      isRole,
    };
  },
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0px 25px;
}

.navbar-left a {
  text-decoration: none;
  color: rgb(55, 48, 48);
}

.navbar-left-logo {
  display: flex;
  align-items: end;
}

.navbar-left-logo img {
  /* border: 1px solid #8080807a;
  border-radius: 40px; */
}

.title {
  margin-left: 6px;
  font-size: 16px;
  letter-spacing: -1px;
  font-weight: 600;
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
  color: rgb(0 0 0 / 41%);
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
    font-size: 30px; /* 아이콘 크기 줄이기 */
  }

  .icon-container {
    gap: 19px;
  }

  .tooltip {
    font-size: 9px;
    bottom: -35px;
  }
}

/* 더 작은 화면 (모바일) 레이아웃 조정 */
@media screen and (max-width: 480px) {
  .title {
    font-size: 15px; /* 타이틀 크기를 더 줄임 */
  }

  .icon {
    font-size: 18px; /* 모바일에 맞게 아이콘 크기 조정 */
  }

  .icon-container {
    gap: 19px;
  }

  .tooltip {
    font-size: 8px;
    bottom: -32px;
  }
}
</style>
