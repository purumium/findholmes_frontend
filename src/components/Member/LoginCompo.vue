<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // jwtDecode는 이렇게 임포트해야 합니다.
import { useStore } from 'vuex';

export default {
  
  setup() {
    const store = useStore(); // Vuex 스토어 인스턴스 가져오기
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const user = computed(() => store.getters.getUser);

    const handleLogin = async () => {
      try {
        const response = await axios.post('/api/member/login', {
          id: username.value,
          password: password.value
        });
        const token = response.data.token;
        const decoded = jwtDecode(token);
        console.log(token);
        console.log(decoded); // 디코딩된 정보 출력

        // Vuex 스토어에 토큰 및 사용자 정보 저장
        store.dispatch('login', {
          token,
          user: decoded.sub
        });

        // 로컬 스토리지에 토큰 저장 (필요한 경우)
        localStorage.setItem('token', token);

        // 추가적인 성공 처리 로직, 예: 페이지 리디렉션
        // window.location.href = '/dashboard'; // 로그인 후 대시보드 페이지로 이동

      } catch (error) {
        console.error(error);
        errorMessage.value = 'Login failed. Please check your credentials.';
      }
    };

    return {
      username,
      password,
      errorMessage,
      handleLogin,
      isAuthenticated,
      user
    };
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
