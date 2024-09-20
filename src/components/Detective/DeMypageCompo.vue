<template>
  <div v-if="loaded" class="mypage-container">
    <header class="mypage-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>홈즈페이지</h2>
      <span class="header-span"></span>
    </header>

    <section class="profile-container">
      <div class="profile-contain">
        <div class="profile-header">
          <img class="profile-picture" :src="profileImage" alt="프로필 사진" />
          <div class="profile-info">
            <h4>{{ userName }}</h4>
            <h5>{{ email }}</h5>
          </div>
        </div>

        <div class="btn">
          <button class="edit-profile-button" @click="doRegister">
            <div>탐정 등록</div>
            <div v-if="approvalStatus === '1'" id="1" class="approval-status">
              <span>등록 필요</span>
            </div>
            <div v-if="approvalStatus === '2'" id="2" class="approval-status">
              <span>승인 대기중</span>
            </div>
            <div v-if="approvalStatus === '3'" id="3" class="approval-status">
              <span>승인 완료</span>
            </div>
          </button>
          <button class="point-button" @click="pointUsageHistory">
            <span>💰 {{ points }}</span>
          </button>
        </div>
      </div>
    </section>

    <div class="mypage-contain">
      <div class="menu">
        <ul>
          <li @click="editMyinfo">
            <p>프로필 편집</p>
            <span>&gt;</span>
          </li>
          <li @click="doPayment">
            <p>포인트결제하기</p>
            <span>&gt;</span>
          </li>
          <li @click="paymentList">
            <p>나의결제내역</p>
            <span>&gt;</span>
          </li>
          <li @click="inquery">
            <p>문의하기</p>
            <span>&gt;</span>
          </li>

          <li @click="deleteAccount">
            <p>회원탈퇴</p>
            <span>&gt;</span>
          </li>
          <li @click="privacyPolicy" class="nav-item">
            <p>개인정보처리방침</p>
            <span>&gt;</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      
      profileImage: "",
      userName: "",
      email: "",
      points: 1000, 
      approvalStatus: "",
      loaded : false
    };
  },
  mounted() {
    this.checkDeRegister();
    this.getUser();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    doRegister() {
      if (this.approvalStatus === "2") {
        alert("탐정 등록 승인 대기중입니다.");
      } else if (this.approvalStatus === "3") {
        alert("탐정 등록 승인 완료 되었습니다.");
      } else {
        this.$router.push("/detective/register");
      }
    },
    editMyinfo() {
      this.$router.push("/detective/myinfo");
    },
    pointUsageHistory() {
      this.$router.push("/detective/point");
    },
    doPayment() {
      this.$router.push("/detective/payment");
    },
    paymentList() {
      this.$router.push("/detective/paymentList");
    },
    inquery() {
      this.$router.push("/detective/inquery");
    },
    deleteAccount() {
      this.$router.push("/detective/deleteaccount");
    },
    privacyPolicy() {
      this.$router.push("/detective/privacypolicy");
    },

    checkDeRegister() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .get("/api/detective/checkregister")
        .then((response) => {
          console.log(response.data);
          if (response.data === "PENDING") {
            this.approvalStatus = "2";
          } else if (response.data === "REJECTED") {
            this.approvalStatus = "1";
          } else if (response.data === "APPROVED") {
            this.approvalStatus = "3";
          } else if (response.data === "NO") {
            this.approvalStatus = "1";
          }
        })
        .catch((error) => {
          console.error("사용자 정보 가지고 오는 중 에러 발생 ", error);
        });
    async getUser(){
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await axios.get("/api/detective/getDetectiveDetail");
        this.userName = response.data.userName
        this.email = response.data.email
        
        
        console.log(response.data)
        if(response.data.profilePicture === null){
          this.profileImage = require('@/assets/detective.png'); // 기본 이미지 경로
        }
        else{
          this.profileImage = this.getImageUrl(response.data.profilePicture);
        }
        
        this.loaded = true
      } catch (error) {
        console.error(error);
      }
    },
    getImageUrl(path){
      return `http://localhost:8080/${path}`;
    },
  },
};
</script>

<style scoped>
.mypage-container {
  max-width: 600px;
  font-family: Arial, sans-serif;
}

.mypage-contain {
  margin: 10px 20px;
}

.mypage-header {
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

.header-span {
  color: #666;
  font-size: 12px;
  margin: 5px 0 0 5px;
}

.profile-container {
  text-align: center;
  margin-top: 20px;
  margin: 20px;
  background-color: #f7f2840d;
  border-radius: 10px;
  border: 1px solid #8080802e;
}

.profile-contain {
  padding: 22px 40px;
}

h4 {
  margin-top: 10px;
  font-size: 16px;
}

h5 {
  margin-top: -19px;
  color: #808080d9;
  font-weight: 400;
  font-size: 15px;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.point-contain {
  display: flex;
  gap: 20px;
  justify-content: space-around;
}

.points-section {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

.btn {
  display: flex;
  gap: 20px;
}

.edit-profile-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 10px;
  background-color: #ffdf3e9c;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
}

.approval-status {
  border: 1px solid #80808000;
  padding: 4px 10px;
  color: #000000;
  letter-spacing: -1px;
  font-size: 10px;
  margin-left: 6px;
  background-color: #ecb900ad;
  border-radius: 20px;
}

.point-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 10px;
  background-color: #ffdf3e9c;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
}

.menu ul {
  list-style: none;
  padding: 5px 0;
}

.menu li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 8px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  font-size: 15px;
  color: #332a2a;
}

.menu li:hover {
  color: #ecb9009c;
  font-weight: 600;
}

/* 태블릿 화면 (max-width: 768px) */
@media screen and (max-width: 768px) {
  .mypage-container {
    max-width: 100%;
  }

  .profile-container {
    margin: 20px;
    padding: 10px;
  }

  .profile-contain {
    padding: 15px 20px;
  }

  .profile-picture {
    width: 80px;
    height: 80px;
  }

  h4 {
    font-size: 14px;
  }

  h5 {
    font-size: 13px;
  }

  .edit-profile-button,
  .point-button {
    padding: 10px;
    font-size: 13px;
  }

  .btn {
    flex-direction: row;
  }

  .menu li {
    font-size: 14px;
    padding: 5px 8px;
  }
}

/* 모바일 화면 (max-width: 420px) */
@media screen and (max-width: 420px) {
  .mypage-container {
    max-width: 100%;
  }

  .profile-container {
    margin: 16px;
    padding: 5px;
  }

  .profile-contain {
    padding: 10px 15px;
  }

  .profile-picture {
    width: 60px;
    height: 60px;
  }

  h4 {
    font-size: 14px;
  }

  h5 {
    margin-top: -13px;
    font-size: 13px;
  }

  .edit-profile-button,
  .point-button {
    padding: 8px;
    font-size: 12px;
  }

  .btn {
    flex-direction: column;
    display: flex;
    gap: 8px;
  }
  .menu ul {
    list-style: none;
    padding: 0px 0;
  }

  .menu li {
    font-size: 13px;
    padding: 4px 6px;
  }
}
</style>
