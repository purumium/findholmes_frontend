<template>
  <div class="inquiry-container">
    <header class="inquiry-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>문의하기</h2>
    </header>

    <div class="nav-buttons">
      <!-- ROLE_USER 버튼 -->
      <div v-if="roles === 'ROLE_USER'" class="nav-btn-wrapper">
        <button
          @click="$router.push('/inquery')"
          :class="{ 'nav-btn': true, active: $route.path === '/inquery' }"
        >
          문의 작성
        </button>
        <button
          @click="$router.push('/inquery/list')"
          :class="{ 'nav-btn': true, active: $route.path === '/inquery/list' }"
        >
          나의 문의 목록
        </button>
      </div>

      <!-- ROLE_DETECTIVE 버튼 -->
      <div v-if="roles === 'ROLE_DETECTIVE'" class="nav-btn-wrapper">
        <button
          @click="$router.push('/detective/inquery')"
          :class="{
            'nav-btn': true,
            active: $route.path === '/detective/inquery',
          }"
        >
          문의 작성
        </button>
        <button
          @click="$router.push('/detective/inquery/list')"
          :class="{
            'nav-btn': true,
            active: $route.path === '/detective/inquery/list',
          }"
        >
          나의 문의 목록
        </button>
      </div>
    </div>

    <router-view></router-view>
    <!-- 자식 컴포넌렌더링 -->
  </div>
</template>

<script>
export default {
  computed: {
    roles() {
      return this.$store.getters.getRoles; // Vuex에서 getRoles를 가져옴
    },
    filteredCategories() {
      return this.roles === "ROLE_DETECTIVE"
        ? this.detectiveCategories
        : this.userCategories;
    },
  },
};
</script>
<style scoped>
.inquiry-container {
  font-family: Arial, sans-serif;
}

.inquiry-header {
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

.nav-btn-wrapper {
  margin: 15px;
  text-align: end;
}

.nav-btn {
  border: none;
  margin-right: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: fantasy;
  background-color: snow;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.active {
  color: #ecb900;
  padding-bottom: 3px;
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
