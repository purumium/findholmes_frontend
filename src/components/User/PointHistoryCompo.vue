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
  methods: {
    goBack() {
      this.$router.push("/mypage");
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
</style>
