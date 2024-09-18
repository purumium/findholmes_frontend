<template>
  <div class="profile-container">
    <header class="myinfo-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>프로필 편집</h2>
    </header>
    <div class="profile-contain">
      <form @submit.prevent="handleProfileSubmit">
        <div class="form-group">
          <label>이메일</label>
          <input v-model="email" type="email" id="email" required readonly />
        </div>
        <div class="form-group">
          <label>이름</label>
          <input v-model="username" type="text" id="username" required />
        </div>
        <div class="form-group">
          <label>휴대폰</label>
          <input v-model="phonenumber" type="text" id="phonenumber" required />
        </div>
        <div>
          <div class="form-group">
            <label>현재 비밀번호</label>
            <input
              v-model="currentPassword"
              type="password"
              id="currentPassword"
              required
            />
          </div>
          <div class="form-group">
            <label>새 비밀번호</label>
            <input
              v-model="newPassword"
              type="password"
              id="newPassword"
              required
            />
          </div>
          <div class="form-group">
            <label>비밀번호 확인</label>
            <input
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              required
            />
          </div>
        </div>
        <div class="button-group">
          <button type="submit" class="btn-profile">프로필 수정</button>
        </div>
      </form>

      <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      email: "",
      phonenumber: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      message: "",
      isPasswordValid: false,
      isSuccess: false,
    };
  },
  methods: {
    goBack() {
      this.$router.push("/mypage");
    },
  },
};
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
}

.myinfo-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #80808012;
}

.back-button {
  font-size: 21px;
  margin-left: 10px;
  background: none;
  border: none;
  cursor: pointer;
}

h2 {
  margin-left: 7px;
  font-size: 17px;
  font-weight: bold;
}

.profile-contain {
  padding: 35px 20px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin: 0 0 8px 14px;
  float: left;
  font-size: 14px;
  font-weight: 600;
  color: #242424;
}

#email {
  background-color: #8080801a;
}

.form-group {
  margin-bottom: 18px;
}

.form-group input {
  width: 90%;
  padding: 12px 0 12px 20px;
  border: 1px solid #80808045;
  border-radius: 20px;
  background-color: #fff;
  font-size: 15px;
}

.button-group {
  margin-top: 5px;
}

.btn-profile,
.btn-password {
  width: 95%;
  padding: 13px;
  border: 1px solid #eae8c1;
  border-radius: 5px;
  background-color: #ffdf3e9c;
  color: #46444a;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-top: 15px;
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
  .profile-form {
    width: 90%;
    padding: 30px;
  }

  .form-group input {
    font-size: 14px;
    padding: 10px 0 10px 15px;
  }

  .btn-profile,
  .btn-password {
    font-size: 13px;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .profile-form {
    width: 100%;
    padding: 20px;
  }

  .form-group input {
    font-size: 13px;
    padding: 8px 0 8px 10px;
  }

  .btn-profile,
  .btn-password {
    font-size: 12px;
    padding: 7px;
  }
}
</style>
