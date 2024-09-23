<template>
  <div class="profile-container">
    <header class="myinfo-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>프로필 편집</h2>
    </header>
    <div class="profile-contain">
      <div class="profile-header">
        <img
          class="profile-picture"
          src="/images/logoforuser_register.png"
          alt="프로필 사진"
        />
        <span class="name">사용자</span>
      </div>
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
          <input v-model="phonenumber" type="text" id="phonenumber" required @input="validatePhoneNumber"/>
        </div>
        <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
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
          <p v-if="passwordMessage" :class="{ error: !isPasswordValid, success: isPasswordValid }">
            {{ passwordMessage }}
          </p>
        </div>
        <div class="button-group">
          <button type="submit" class="btn-profile" :disabled="!isPasswordValid">프로필 수정</button>
        </div>
      </form>

      <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
      passwordMessage: "",
      isSuccess: false,
    };
  },
  watch: {
    newPassword(value) {
      console.log(value)
      this.checkPasswordMatch();
    },
    confirmPassword(value) {
      console.log(value)
      this.checkPasswordMatch();
    }
  },
  mounted() {
    this.getUser();
  },
  methods: {
    goBack() {
      this.$router.push("/mypage");
    },
    async getUser(){
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await axios.get("/api/member/userinfo");
        this.username = response.data.userName;
        this.email = response.data.email;
        this.phonenumber = response.data.phoneNumber;
      } catch (error) {
        console.error(error);
      }
    },
    checkPasswordMatch() {
      if (this.newPassword === this.confirmPassword) {
        this.isPasswordValid = true;
        this.passwordMessage = "비밀번호가 일치합니다.";
      } else {
        this.isPasswordValid = false;
        this.passwordMessage = "비밀번호가 일치하지 않습니다.";
      }
    },
    async handleProfileSubmit(){
      if (!this.isPasswordValid) {
        this.message = "비밀번호가 일치하지 않습니다.";
        this.isSuccess = false;
        return;
      }
      // 프로필 수정 로직 추가
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await axios.get("/api/member/pwCheck", {
          params: { password: this.currentPassword }
        });
        if(response.data){
          try{
            const response2 = await axios.post("/api/member/update", {
              password : this.confirmPassword,
              userName: this.username,
              phoneNumber : this.phonenumber
              
            });
            console.log(response2.data)
          }catch(error){
            console.log(error)
          }
          alert("회원정보 수정 완료")
        }else{
          alert("현재비밀번호가 다릅니다")
        }
        
      } catch (error) {
        console.error(error);
      }
    }
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
