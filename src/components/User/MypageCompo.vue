<template>
  <div class="mypage">
    <div class="profile-header">
      <img class="profile-picture" :src="profileImage" alt="프로필 사진" />
      <div class="profile-info">
        <h2>{{ userName }}</h2>
        <p>{{ email }}</p>
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

    <div class="menu">
      <ul>
        <li @click="reviewlist" class="nav-item">내리뷰보기</li>
        <li @click="doPayment" class="nav-item">포인트결제</li>
        <li @click="paymentList" class="nav-item">내결제내역</li>
        <li @click="contactUs" class="nav-item">문의하기</li>
        <li @click="deleteAccount" class="nav-item">회원탈퇴</li>
        <li @click="privacyPolicy" class="nav-item">개인정보처리방침</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profileImage: "https://via.placeholder.com/150", // 기본 프로필 이미지
      userName: "선선선선해",
      email: "one@gmail.com",
      points: 1000, // 포인트 기본값
    };
  },
  methods: {
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
    contactUs() {
      this.$router.push("/contactus");
    },
    deleteAccount() {
      this.$router.push("/deleteaccount");
    },
    privacyPolicy() {
      this.$router.push("/privacypolicy");
    },
  },
};
</script>

<style scoped>
.mypage {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px 25px;
  font-family: Arial, sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  margin: 35px 0;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.profile-info {
  flex-grow: 1;
}

h2 {
  margin: 0;
  font-size: 24px;
}

.follow-info {
  margin-top: 10px;
  color: gray;
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
  display: block;
  width: 100%;
  padding: 12px 10px;
  background-color: #efe794;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
}

.menu {
  margin-top: 20px;
}

.menu ul {
  list-style: none;
  padding: 20px 0;
}

.menu li {
  padding: 20px 5px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.menu li:hover {
  color: #007bff;
}
</style>
