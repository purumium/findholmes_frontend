<template>
  <div class="mypage-container">
    <header class="mypage-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>마이페이지</h2>
      <span class="header-span"></span>
    </header>

    <section class="profile-container">
      <div class="profile-contain">
        <div class="profile-header">
          <div class="header-picture">
            <img
              class="profile-picture"
              :src="profileImage"
              alt="프로필 사진"
            />
            <span class="name">사용자</span>
          </div>
          <div class="profile-info">
            <h4>{{ userName }}</h4>
            <h5>{{ email }}</h5>
          </div>
        </div>

        <div class="btn">
          <button class="edit-profile-button" @click="editMyinfo">
            <span>프로필 편집</span>
          </button>
          <button class="edit-profile-button" @click="pointUsageHistory">
            <span>💰 {{ points }} 포인트</span>
          </button>
        </div>
      </div>
    </section>

    <div class="mypage-contain">
      <div class="menu">
        <ul>
          <li @click="reviewlist">
            <p>나의리뷰보기</p>
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
      profileImage: "/images/logoforuser_register.png", // 기본 프로필 이미지
      userName: "",
      email: "",
      points: "0", // 포인트 기본값
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    editMyinfo() {
      this.$router.push("/myinfo");
    },
    pointUsageHistory() {
      this.$router.push("/point");
    },
    reviewlist() {
      this.$router.push("/reviewlist");
    },
    doPayment() {
      this.$router.push("/payment");
    },
    paymentList() {
      this.$router.push("/paymentList");
    },
    inquery() {
      this.$router.push("/inquery");
    },
    deleteAccount() {
      this.$router.push("/deleteaccount");
    },
    privacyPolicy() {
      this.$router.push("/privacypolicy");
    },
    async getUser() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get("/api/member/user/allinfo");
        this.userName = response.data.userName;
        this.email = response.data.email;
        this.points = response.data.currentPoints;

        console.log(response.data);
      } catch (error) {
        console.error(error);
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
  padding: 22px 25px;
}

h4 {
  margin-top: -8px;
  font-size: 20px;
}

h5 {
  margin-top: -26px;
  color: #808080d9;
  font-weight: 400;
  font-size: 15px;
}

.profile-picture {
  width: 100px;
  height: 110px;
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

.name {
  border: 1px solid #ffdf3e99;
  padding: 5px 7px 4px 7px;
  border-radius: 20px;
  color: #534c4c;
  background-color: #ffdf3e99;
  font-size: 12px;
  /* margin-right: 3px; */
  font-weight: 600;
  position: relative;
  left: 3px;
  top: -21px;
}

.btn {
  display: flex;
  gap: 15px;
  margin-top: -10px;
}

.edit-profile-button {
  display: block;
  width: 100%;
  padding: 12px 10px;
  background-color: #ffdf3e9c;
  border: none;
  border-radius: 5px;
  font-size: 14px;
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

/* 모바일 화면 (480px 이하) */
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

  .profile-contain {
    padding: 17px 15px;
  }

  .btn {
    margin-top: -8px;
    display: flex;
    gap: 20px;
  }
  .menu ul {
    list-style: none;
    padding: 0px 0;
  }
  .mypage-contain {
    margin: 10px 20px 30px 20px;
  }

  h4 {
    margin-top: -3px;
    font-size: 17px;
  }

  h5 {
    margin-top: -22px;
    font-size: 13px;
  }

  .name {
    border: 1px solid #ffdf3e99;
    padding: 3px 5px 3px 5px;
    border-radius: 20px;
    color: #534c4c;
    background-color: #ffdf3e99;
    font-size: 10.5px;
    margin-right: 3px;
    font-weight: 600;
  }

  .edit-profile-button {
    display: block;
    width: 100%;
    padding: 12px 10px;
    background-color: #ffdf3e9c;
    border: none;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 600;
  }
}
</style>
