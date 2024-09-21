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
              <img
                src="/images/logoforuser_register.png"
                width="65px"
                height="70x"
                alt="사용자"
              />
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
              <img
                src="/images/logofordetective_register.png"
                width="80px"
                height="70px"
                alt="탐정"
              />
              <div><span class="name">탐정</span><span>홈즈</span></div>
            </label>
          </div>
        </div>

        <!-- 회원 가입-->
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="이메일"
            required
            @blur="checkEmail"
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
            placeholder="이름"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="패스워드"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="phonenumber"
            type="text"
            id="phonenumber"
            placeholder="전화번호"
            required
          />
        </div>
        <div class="button-group">
          <button type="submit" class="btn-register" :disabled="!isEmailValid">
            가입하기
          </button>
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
const checkEmail = async () => {
  try {
    const response = await axios.get("/api/member/check-email", {
      params: { email: email.value },
    });
    if (response.data) {
      emailStatus.value = "사용 가능한 이메일입니다.";
      isEmailValid.value = true;
    } else {
      emailStatus.value = "이미 사용 중인 이메일입니다.";
      isEmailValid.value = false;
    }
  } catch (error) {
    emailStatus.value = "이메일 확인에 실패했습니다.";
    isEmailValid.value = false;
  }
};

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
  padding: 16px 0 13px 20px;
  border: 1px solid #80808045;
  border-radius: 20px;
  background-color: #fff;
  font-size: 13px;
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
  font-size: 14px;
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

.name {
  border: 1px solid #ffdf3e99;
  padding: 3px 5px;
  border-radius: 20px;
  color: #534c4c;
  background-color: #ffdf3e99;
  font-size: 11px;
  margin-right: 3px;
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
@media (max-width: 768px) {
  .register-form {
    width: 90%;
    padding: 30px;
  }

  .form-group input {
    width: 86%;
  }

  .role-label {
    padding: 17px 60px;
  }

  .btn-register {
    font-size: 13px;
    padding: 10px;
    width: 90%;
  }
}

@media (max-width: 600px) {
  .role-label {
    padding: 15px 46px;
  }
}

@media (max-width: 500px) {
  .role-selection {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }

  .register-form {
    width: 100%;
    padding: 25px;
  }

  .form-group input {
    font-size: 12px;
    padding: 15px 0 13px 15px;
  }

  .role-label {
    padding: 15px 45px;
  }

  .btn-register {
    font-size: 12px;
    padding: 7px;
  }
}

@media (max-width: 420px) {
  .register-form {
    width: 100%;
    padding: 30px;
  }

  .form-group input {
    font-size: 12px;
    padding: 15px 0 13px 15px;
  }

  .role-label {
    padding: 13px 26px;
  }

  .btn-register {
    font-size: 12px;
    padding: 7px;
  }
}
</style>
