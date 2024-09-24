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
            <div>
              <div v-if="approvalStatus === '1'" id="1" class="approval-status">
                <span>등록 필요</span>
              </div>
              <div v-if="approvalStatus === '2'" id="2" class="approval-status">
                <span>승인 대기중</span>
              </div>
              <div v-if="approvalStatus === '3'" id="3" class="approval-status">
                <span>승인 완료</span>
              </div>
              <div
                v-if="approvalStatus === '4'"
                id="1"
                class="approval-status reject"
              >
                <span>😢 승인 거절</span>
              </div>
            </div>
            <div>탐정 등록하기</div>
          </button>
          <button class="point-button" @click="pointUsageHistory">
            <span>💰 {{ points }} 포인트</span>
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
    <div
      v-if="isRejectionModalVisible"
      class="modal-overlay"
      @click="closeRejectionModal"
    >
      <div class="modal-content" @click.stop>
        <h3>탐정 등록 거부 사유</h3>
        <div class="reject-reason">
          {{ rejectionReason }}
        </div>
        <div>
          <button
            @click="closeRejectionModal"
            class="close-button"
            style="margin-right: 5%"
          >
            닫기
          </button>
          <button @click="doReRegister" class="close-button">재등록</button>
        </div>
      </div>
    </div>
  </div>
  <div>
    <button @click="sendEmail">Login with Google</button>
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
      rejectionReason: "",
      loaded: false,
      isRejectionModalVisible: "",
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
      } else if (this.approvalStatus === "4") {
        this.isRejectionModalVisible = true; // 모달 열기
        // this.$router.push("/detective/register");
      } else {
        const someValue = "register";
        this.$router.push(`/detective/register?value=${someValue}`);
      }
    },
    doReRegister() {
      const someValue = "reregister";
      this.$router.push(`/detective/register?value=${someValue}`);
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
          } else if (response.data === "APPROVED") {
            this.approvalStatus = "3";
          } else if (response.data === "REJECTED") {
            this.getRejectReason();
            this.approvalStatus = "4";
          } else if (response.data === "NO") {
            this.approvalStatus = "1";
          }
        })
        .catch((error) => {
          console.error("사용자 정보 가지고 오는 중 에러 발생 ", error);
        });
    },
    getRejectReason() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .get("/api/detective/checkreject")
        .then((response) => {
          this.rejectionReason = response.data.rejReason;
          console.log("reject reason : " + this.rejReason);
        })
        .catch((error) => {
          console.error("사용자 정보 가지고 오는 중 에러 발생 ", error);
        });
    },
    async getUser() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.get("/api/detective/getDetectiveDetail");
        this.userName = response.data.userName;
        this.email = response.data.email;

        if (response.data.profilePicture === null) {
          this.profileImage = "/images/logofordetective_register.png"; // 기본 이미지 경로
        } else {
          this.profileImage = this.getImageUrl(response.data.profilePicture);
        }

        this.loaded = true;
      } catch (error) {
        console.error(error);
      }
    },
    getImageUrl(path) {
      return `http://localhost:8080/${path}`;
    },
    closeRejectionModal() {
      this.isRejectionModalVisible = false;
    },

    async sendEmail() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.post("/api/email/send", {
          to: "purumium@gmail.com",
          subject: "테스트",
          body: "테스트입니다",
        });
        console.log(response.data);
      } catch (error) {
        console.error("Email sending failed:", error);
      }
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
  background-color: #d4d4d430;
  border-radius: 10px;
  border: 1px solid #8080802e;
}

.profile-contain {
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

h4 {
  margin-top: 4px;
  font-size: 17px;
}

h5 {
  margin-top: -20px;
  margin-bottom: 0px;
  color: #808080d9;
  font-weight: 400;
  font-size: 15px;
}

.profile-picture {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px solid #80808030;
  padding: 0px;
}

.point-contain {
  display: flex;
  gap: 10px;
  justify-content: space-around;
}

.points-section {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

.btn {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: -10px;
}

.edit-profile-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 15px 50px;
  background-color: #ffdf3e9c;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
}

.approval-status {
  border: 1px solid #80808000;
  padding: 2px 10px;
  color: #000000;
  letter-spacing: -1px;
  font-size: 11px;
  background-color: #ecb900ad;
  border-radius: 20px;
}

.reject {
  background-color: #297b09ad !important;
  color: white !important;
  letter-spacing: 0px;
}

.point-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 40px;
  background-color: #ffdf3e9c;
  border: none;
  border-radius: 5px;
  font-size: 15px;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 300px;
  width: 100%;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.reject-reason {
  border: 1px solid #80808029;
  padding: 10px 20px;
  text-align: justify;
  min-width: 235px;
  min-height: 100px;
  border-radius: 10px;
}

h3 {
  margin-top: 5px;
}

.close-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ffdf3e9c;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  width: 45%;
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
    padding: 10px 40px;
    font-size: 13px;
  }

  .menu li {
    font-size: 14px;
    padding: 5px 8px;
  }
}

@media screen and (max-width: 480px) {
  h2 {
    font-size: 14px;
  }

  .back-button {
    font-size: 15px;
    margin-left: 0px;
    padding: 8px 15px;
    background: none;
    border: none;
    cursor: pointer;
  }

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

  .approval-status {
    border: 1px solid #80808000;
    padding: 2px 10px;
    color: #000000;
    letter-spacing: -1px;
    font-size: 10px;
    background-color: #ecb900ad;
  }

  .edit-profile-button,
  .point-button {
    padding: 10px;
    font-size: 11px;
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
