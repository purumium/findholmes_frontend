<template>
  <div class="register-container">
    <div class="register-form">
      <div class="register-logo"></div>
      <form @submit.prevent="handleSubmit">
        <!-- 역할 선택 -->
        <div class="form-group role-selection">
          <div class="role-option">
            <input
              type="radio"
              id="role_user"
              value="ROLE_USER"
              v-model="role"
              hidden
            />
            <label
              for="role_user"
              :class="{ active: role === 'ROLE_USER' }"
              class="role-label"
            >
              <img src="@/assets/user.png" width="70px" alt="사용자" />
              사용자
            </label>
          </div>
          <div class="role-option">
            <input
              type="radio"
              id="role_detective"
              value="ROLE_DETECTIVE"
              v-model="role"
              hidden
            />
            <label
              for="role_detective"
              :class="{ active: role === 'ROLE_DETECTIVE' }"
              class="role-label"
            >
              <img src="@/assets/detective.png" width="70px" alt="탐정" />
              탐정
            </label>
          </div>
        </div>

        <!-- 회원 가입-->
        <!-- <div class="form-group">
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Email"
            required
            @blur="checkEmail"
          />
          <p
            v-if="emailStatus"
            :class="{ success: isEmailValid, error: !isEmailValid }"
          >
            {{ emailStatus }}
          </p>
        </div> -->
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Email"
            required
          />
          <p
            v-if="emailStatus"
            :class="{ success: isEmailValid, error: !isEmailValid }"
          >
            {{ emailStatus }}
          </p>
        </div>
        <div class="form-group">
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Username"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="phonenumber"
            type="text"
            id="phonenumber"
            placeholder="Phone Number"
            required
          />
        </div>
        <div class="button-group">
          <!-- <button type="submit" class="btn-register" :disabled="!isEmailValid"> -->
          <button type="submit" class="btn-register">가입하기</button>
        </div>
      </form>
      <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const email = ref("");
const phonenumber = ref("");
const password = ref("");
const role = ref("ROLE_USER");
const message = ref("");
const emailStatus = ref("");
const isEmailValid = ref(false);
const isSuccess = ref(false);

// 이메일 중복 체크 함수
// const checkEmail = async () => {
//   try {
//     const response = await axios.get("/api/member/check-email", {
//       params: { email: email.value },
//     });
//     if (response.data) {
//       emailStatus.value = "사용 가능한 이메일입니다.";
//       isEmailValid.value = true;
//     } else {
//       emailStatus.value = "이미 사용 중인 이메일입니다.";
//       isEmailValid.value = false;
//     }
//   } catch (error) {
//     emailStatus.value = "이메일 확인에 실패했습니다.";
//     isEmailValid.value = false;
//   }
// };

const handleSubmit = async () => {
  try {
    const response = await axios.post("/api/member/register", {
      userName: username.value,
      email: email.value,
      phoneNumber: phonenumber.value,
      password: password.value,
      role: role.value,
    });
    message.value = response.data;
    isSuccess.value = true;
    router.push("/login");
  } catch (error) {
    message.value =
      "Registration failed: " + (error.response?.data || error.message);
    isSuccess.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}

.register-form {
  padding: 40px;
  text-align: center;
  width: 400px;
}

.register-logo {
  margin-bottom: 30px;
}

.register-logo img {
  width: 150px;
  border-radius: 100px;
  border: 1px solid #2f4f4f2e;
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

/* 역할 선택 섹션 스타일 */
.role-selection {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.role-option {
  cursor: pointer;
}

.role-label {
  display: flex;
  font-size: 13px;
  font-weight: 600;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  border: 2px solid transparent;
  padding: 15px 50px;
  border-radius: 20px;
  transition: border-color 0.3s ease;
}

.role-label.active {
  border-color: #ffdf3e9c; /* 선택된 경우 테두리 색상 변경 */
}

.role-option input[type="radio"] {
  display: none; /* 라디오 버튼 숨기기 */
}

.button-group {
  margin-top: 25px;
}

.btn-register {
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

.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}

/* 반응형 스타일 */

/* 태블릿 화면 (768px 이하) */
@media (max-width: 768px) {
  .register-form {
    width: 90%;
    padding: 30px;
  }

  .form-group input {
    font-size: 14px;
    padding: 10px 0 10px 15px;
  }

  .role-label {
    padding: 10px 30px;
  }

  .btn-register {
    font-size: 13px;
    padding: 8px;
  }
}

/* 모바일 화면 (480px 이하) */
@media (max-width: 480px) {
  .register-form {
    width: 100%;
    padding: 20px;
  }

  .form-group input {
    font-size: 13px;
    padding: 8px 0 8px 10px;
  }

  .role-label {
    padding: 8px 20px;
  }

  .btn-register {
    font-size: 12px;
    padding: 7px;
  }
}
</style>
