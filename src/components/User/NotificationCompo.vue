<template>
  <div class="notification-container">
    <header class="notification-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>알림</h2>
      <span class="header-span"></span>
    </header>

    <div class="notification-contain">알림</div>
  </div>
</template>

<script>
export default {
  computed: {
    roles() {
      return this.$store.getters.getRoles; // Vuex에서 getRoles를 가져옴
    },
  },
  methods: {
    goBack() {
      if (this.$route.path.startsWith("/detective")) {
        // 현재 경로가 '/detective'로 시작하면 브라우저 히스토리에서 뒤로 가기
        this.$router.go(-1);
      } else {
        this.$router.push("/mypage");
      }
    },
  },
};
</script>

<style scoped>
.notification-container {
  font-family: Arial, sans-serif;
}

.notification-header {
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

.notification-contain {
  margin: 25px 20px;
}

@media screen and (max-width: 480px) {
  h2 {
    font-size: 14px;
  }

  .back-button {
    font-size: 15px;
    margin-left: 0px;
    padding: 8px 15px;
    background: none;
    border: none;
    cursor: pointer;
  }
}
</style>
