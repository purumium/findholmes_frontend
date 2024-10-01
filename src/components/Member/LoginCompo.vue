<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-logo">
        <img src="/images/logoforlogin.png" />
      </div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="e-mail"
            required
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="password"
            required
          />
        </div>
        <div class="button-group">
          <button type="submit" class="btn-login">로그인</button>
          <button type="button" class="btn-login" @click="goToRegister">
            회원가입
          </button>
        </div>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // jwtDecode는 이렇게 임포트해야 합니다.
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore(); // Vuex 스토어 인스턴스 가져오기
    const router = useRouter(); // router 인스턴스 가져오기

    const username = ref("");
    const password = ref("");
    const errorMessage = ref("");

    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const user = computed(() => store.getters.getUser);

    const handleLogin = async () => {
      try {
        const response = await axios.post(
          "/api/member/login",
          {
            id: username.value,
            password: password.value,
          },
          {
            withCredentials: true, // 인증 정보를 포함하도록 설정
          }
        );
        const token = response.data.token;
        const decoded = jwtDecode(token);

        console.log(token);
        console.log("role : " + decoded); // 디코딩된 정보 출력

        // Vuex 스토어에 토큰 및 사용자 정보 저장
        store.dispatch("login", {
          token,
          user: decoded.sub,
          roles: decoded.roles, // 역할 저장 (roles 배열일 수 있음)
        });

        // 로컬 스토리지에 토큰 저장 (필요한 경우)
        localStorage.setItem("token", token);

        // 화면이 이동(탐정화면, 의뢰인 화면, 관리자)
        if (decoded.roles.includes("ROLE_DETECTIVE")) {
          router.push("/detective");
        } else if (decoded.roles.includes("ROLE_USER")) {
          router.push("/");
        } else if (decoded.roles.includes("ROLE_ADMIN")) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        errorMessage.value = "Login failed. Please check your credentials.";
      }
    };

    const goToRegister = () => {
      router.push("/register"); // 회원가입 화면 이동
    };

    return {
      username,
      password,
      errorMessage,
      handleLogin,
      isAuthenticated,
      user,
      goToRegister, // 회원가입 버튼 클릭 시 호출할 함수
    };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}

.login-box {
  padding: 40px;
  text-align: center;
  width: 400px;
}

.login-logo {
  margin-bottom: 20px;
}

.login-logo img {
  width: 160px;
  border-radius: 100px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  width: 90%;
  padding: 12px 0 12px 20px;
  border: 1px solid #80808045;
  border-radius: 20px;
  background-color: #fff;
  font-size: 15px;
}

.btn-login {
  width: 95%;
  padding: 10px;
  border: 1px solid #eae8c1;
  border-radius: 5px;
  background-color: #ffdf3e9c;
  color: #46444a;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin: 7px;
}

.error {
  color: red;
  margin-top: 10px;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .login-box {
    width: 90%;
    padding: 30px;
  }

  .form-group input {
    font-size: 14px;
    padding: 10px 0 10px 15px;
  }

  .btn-login {
    font-size: 13px;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .login-box {
    width: 100%;
    padding: 20px;
  }

  .form-group input {
    font-size: 13px;
    padding: 8px 0 8px 10px;
  }

  .btn-login {
    font-size: 12px;
    padding: 7px;
  }
}
</style>
