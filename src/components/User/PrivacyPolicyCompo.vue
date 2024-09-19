<template>
  <div class="review-container">
    <header class="review-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>개인정보처리방침</h2>
    </header>

    <div class="review-contain">
      <div>개인정보처리방침</div>
    </div>
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
      if (this.roles === "ROLE_DETECTIVE") {
        this.$router.push("/detective/mypage");
      } else {
        this.$router.push("/mypage");
      }
    },
  },
};
</script>

<style scoped>
.review-container {
  font-family: Arial, sans-serif;
}

.review-header {
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

.review-contain {
  margin: 25px 20px;
}
</style>
