<template>
  <div class="header">
    <router-link to="/">로고 </router-link>
    <router-link to="/request">의뢰요청 </router-link>
    <router-link to="/find">탐정찾기 </router-link>
    <router-link to="/receive">받은견적 </router-link>
    <router-link to="/login">로그인 </router-link>
    <router-link to="/register">회원가입 </router-link>
    <button @click="handleLogout">로그아웃</button>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    // 로그아웃 처리 함수
    const handleLogout = async () => {
      await store.dispatch('logout'); // Vuex의 logout 액션 호출
      console.log(store.state)
      router.push('/login'); // 로그아웃 후 로그인 페이지로 리디렉션 (원하는 페이지로 변경 가능)
    };

    return {
      handleLogout
    };
  }
};
</script>

<style scoped> 

</style>