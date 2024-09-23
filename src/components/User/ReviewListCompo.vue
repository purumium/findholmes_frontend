<template>
  <div class="review-container">
    <header class="review-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>나의 리뷰 보기</h2>
    </header>

    <div class="review-contain">
      <div>리뷰 보기</div>
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
