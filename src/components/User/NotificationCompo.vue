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
export default {};
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
</style>
