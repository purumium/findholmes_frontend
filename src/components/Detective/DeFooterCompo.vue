<template>
  <footer>
    <nav class="footer-nav">
      <ul>
        <li>
          <router-link
            to="/detective/requestlist"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'pencil-alt']" />
            <span class="text">받은의뢰서</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/detective/estimatelist"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'search']" />
            <span class="text">보낸답변서</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/detective"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'home']" />
            <span class="text">홈</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/detective/chat"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon :icon="['fas', 'comment-dots']" class="icon" />
            <span class="text">채팅</span>
          </router-link>
        </li>

        <li>
          <router-link
            to="/detective/mypage"
            class="footer-item"
            active-class="active"
          >
            <font-awesome-icon class="icon" :icon="['fas', 'user']" />
            <span class="text">홈즈페이지</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
footer {
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
</style>
