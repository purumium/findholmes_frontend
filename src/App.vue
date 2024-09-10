<template>
  <div id="app" class="container">
    <!-- 탐정으로 로그인한 경우 -->
    <div class="wrapper" v-if="isDetective">
      <DeHeaderCompo class="header"></DeHeaderCompo>
      <DeMiddleCompo class="middle"></DeMiddleCompo>
      <DeFooterCompo class="footer"></DeFooterCompo>
    </div>

    <!-- 일반 사용자로 로그인한 경우 -->
    <div class="wrapper" v-else-if="isUser">
      <HeaderCompo class="header"></HeaderCompo>
      <MiddleCompo class="middle"></MiddleCompo>
      <FooterCompo class="footer"></FooterCompo>
    </div>

    <!-- 로그인하지 않은 경우 -->
    <div class="wrapper" v-else>
      <HeaderCompo class="header"></HeaderCompo>
      <MiddleCompo class="middle"></MiddleCompo>
      <FooterCompo class="footer"></FooterCompo>
    </div>
  </div>
</template>

<script>
import FooterCompo from "./components/FooterCompo.vue";
import HeaderCompo from "./components/HeaderCompo.vue";
import MiddleCompo from "./components/MiddleCompo.vue";
import DeHeaderCompo from "./components/Detective/DeHeaderCompo.vue";
import DeMiddleCompo from "./components/Detective/DeMiddleCompo.vue";
import DeFooterCompo from "./components/Detective/DeFooterCompo.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    HeaderCompo,
    FooterCompo,
    MiddleCompo,
    DeHeaderCompo,
    DeMiddleCompo,
    DeFooterCompo,
  },
  computed: {
    ...mapGetters(["getRoles"]), // Vuex의 getRoles 가져오기

    isDetective() {
      this.getRoles === "ROLE_DETECTIVE";
      return this.getRoles === "ROLE_DETECTIVE";
    },
    isUser() {
      return this.getRoles === "ROLE_USER";
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: "Arial", sans-serif;
  overflow-y: scroll;
}

.container {
  min-width: 320px;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  border: 1px solid #80808052;
}

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 헤더, 미들, 푸터가 전체 높이 차지 */
  width: 100%; /* container가 100% 너비를 차지하도록 설정 */
}

.header {
  width: 100%; /* 부모의 너비를 따르게 설정 */
  height: 90px;
  z-index: 10;
  background-color: #f9f9f9;
}

.middle {
  flex: 1;
  overflow-y: auto; /* 세로 스크롤만 허용 */
  overflow-x: hidden; /* 가로 스크롤 없애기 */
  padding: 10px;
  background-color: #fff;
  font-size: 1rem; /* 기본 폰트 크기 */
  width: 100%;
  box-sizing: border-box; /* 패딩과 테두리까지 width에 포함되도록 설정 */
}

.footer {
  width: 100%;
  height: 90px; /* footer의 높이 설정 */
  z-index: 10;
  background-color: #f9f9f9;
  /* border-top: 1px solid #ccc; */
}

/* 반응형 스타일 */
@media screen and (max-width: 1024px) {
  .container {
    width: 80%; /* 화면이 작아지면 너비를 80%로 조정 */
  }

  .middle {
    font-size: 0.9rem; /* 글자 크기 축소 */
  }
}

@media screen and (max-width: 768px) {
  .container {
    width: 100%; /* 모바일에서는 100% */
    padding: 10px;
  }

  .middle {
    font-size: 0.85rem; /* 글자 크기 더 축소 */
  }
}

@media screen and (max-width: 480px) {
  .container {
    width: 100%; /* 작은 모바일에서도 100% */
    padding: 5px;
  }

  .middle {
    font-size: 0.8rem; /* 모바일에서 글자 크기 더 축소 */
  }
}
</style>
