<template>
  <div class="mypage-container">
    <nav class="mypage-nav">
      <ul>
        <li>
          <router-link
            to="/detective/mypage/myinfo"
            class="nav-item"
            active-class="active"
            >내정보보기</router-link
          >
        </li>
        <li>
          <router-link
            to="/detective/mypage/payment"
            class="nav-item"
            active-class="active"
            >포인트결제</router-link
          >
        </li>
        <li>
          <router-link
            to="/detective/mypage/paymentlist"
            class="nav-item"
            active-class="active"
            >내결제내역</router-link
          >
        </li>
        <li>
          <router-link
            to="/detective/mypage/deregister"
            class="nav-item"
            active-class="active"
            >탐정등록</router-link
          >
        </li>
        <li>
          <router-link
            to="/detective/mypage/test"
            class="nav-item"
            active-class="active"
            >관리자승인</router-link
          >
        </li>
      </ul>
    </nav>

    <div class="content">
      <router-view></router-view>
      <!-- 각 페이지의 내용을 렌더링 -->
    </div>
  </div>
</template>

<script>
export default {
  name: "MyPage",
};
</script>

<style scoped>
.mypage-container {
  width: 100%;
  padding: 20px;
}

.mypage-nav ul {
  display: flex;
  justify-content: end;
  gap: 30px;
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 0px solid #ccc;
}

.mypage-nav li {
  font-size: 12px;
  padding: 5px 0;
}

.nav-item {
  color: rgb(0 0 0 / 41%);
  text-decoration: none;
}

.active {
  color: rgba(0, 0, 0, 0.952);
  font-weight: 600;
}

.content {
  padding: 20px;
}
</style>
