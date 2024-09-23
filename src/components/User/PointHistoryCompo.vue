<template>
  <div class="point-container">
    <header class="point-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>포인트 사용내역</h2>
    </header>

    <div class="point-contain">
      <div>포인트 사용내역</div>
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
.point-container {
  font-family: Arial, sans-serif;
}

.point-header {
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

.point-contain {
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
