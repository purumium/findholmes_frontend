<template>
  <div class="footer-container">
    <nav class="footer-nav" v-if="isRole === 'ROLE_ADMIN'">
      <ul>
        <li>
          <router-link
            to="/admin/approval"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'pencil-alt']" />
            <span class="text">홈즈승인</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/inquery"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'search']" />
            <span class="text">문의관리</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin" class="footer-item" active-class="active">
            <font-awesome-icon class="icon" :icon="['fas', 'home']" />
            <span class="text">홈 </span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/chart"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'user']" />
            <span class="text">가입자현황</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/paymentchart"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'envelope']" />
            <span class="text">결제현황</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <nav class="footer-nav" v-else>
      <ul>
        <li>
          <router-link
            :to="!isAuthenticated ? '/login' : '/request'"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'pencil-alt']" />
            <span class="text">의뢰서작성 </span>
          </router-link>
        </li>
        <li>
          <router-link to="/find" class="footer-item" active-class="active">
            <font-awesome-icon class="icon" :icon="['fas', 'search']" />
            <span class="text">홈즈찾기</span>
          </router-link>
        </li>
        <li>
          <router-link to="/" class="footer-item" active-class="active">
            <font-awesome-icon class="icon" :icon="['fas', 'home']" />
            <span class="text">홈</span>
          </router-link>
        </li>
        <li>
          <router-link
            :to="!isAuthenticated ? '/login' : '/receive'"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'envelope']" />
            <span class="text">의뢰&답변</span>
          </router-link>
        </li>
        <li>
          <router-link
            :to="!isAuthenticated ? '/login' : '/mypage'"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'user']" />
            <span class="text">마이페이지</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  setup() {
    const store = useStore();

    // Vuex에서 로그인 상태를 가져오기
    const isAuthenticated = computed(() => store.getters.isAuthenticated);

    // Vuex에서 역할 가져오기
    const isRole = computed(() => store.getters.getRoles);

    return {
      isAuthenticated,
      isRole,
    };
  },
};
</script>

<style scoped>
.footer-container {
  display: flex;
  align-items: center;
}

.footer-nav {
  display: flex;
  justify-content: center; /* nav를 가로로 중앙에 배치 */
  align-items: center;
  width: 100%; /* 화면 너비에 맞게 확장 */
}

.footer-nav ul {
  display: flex;
  justify-content: space-evenly; /* 각 아이템을 균등하게 배치 */
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%; /* nav가 화면 너비에 맞게 확장됨 */
}

.footer-nav li {
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  align-items: center; /* 중앙 정렬 */
}

.footer-nav li a {
  color: rgb(0 0 0 / 41%);
  text-decoration: none;
  display: flex;
  flex-direction: column; /* 아이콘과 텍스트를 세로로 정렬 */
  align-items: center;
}

.footer-item {
  color: rgba(0, 0, 0, 0.76); /* 기본 글자 색 */
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-item:hover {
  color: #191817; /* 마우스 오버 시 색상 */
}

.footer-item.active {
  color: #191817; /* 눌렸을 때의 색상 */
}

.icon {
  font-size: 24px; /* 아이콘 크기 설정 */
  margin-bottom: 5px; /* 아이콘과 텍스트 사이의 간격 */
}

.text {
  font-size: 11px; /* 텍스트 크기 설정 */
}

@media screen and (max-width: 600px) {
  .text {
    font-size: 10px;
  }
}

@media screen and (max-width: 480px) {
  .icon {
    font-size: 20px;
    margin-bottom: 5px;
  }

  .text {
    font-size: 9px;
  }
}
</style>
