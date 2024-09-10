<template>
  <div class="estimate-detail-container">
    <h2>받은 견적서 상세보기</h2>
    <div class="estimate-detail">
      <!-- 사이드 바 -->
      <div class="sidebar">
        <ul>
          <li
            v-for="(detective, index) in detectives"
            :key="index"
            @click="selectDetective(detective)"
          >
            <div class="detective-info">
              <div class="detective-details">
                <div class="detective-name">{{ detective.name }}</div>
                <div class="detective-price">{{ detective.price }}원</div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 탐정의 견적서-->
      <div class="main-content" v-if="selectedDetective">
        <div class="main-content-line">
          <div class="estimate-header">
            <!-- 탐정 정보 및 프로필 보기 -->
            <div class="detective-info-container">
              <div class="detective-img">
                <img
                  class="detective-avatar-large"
                  :src="selectedDetective.avatar"
                  alt="Detective Avatar"
                />
              </div>
              <div class="detective-details-large">
                <div class="detective-name-container">
                  <h3>{{ selectedDetective.name }}</h3>
                  <button class="profile-button">프로필 보기</button>
                </div>
                <div class="detective-contact">
                  <span>🔒 {{ selectedDetective.nickname }}</span>
                  <span>📞 {{ selectedDetective.phone }}</span>
                  <span>📍 {{ selectedDetective.location }}</span>
                </div>
              </div>
            </div>
            <div class="detective-price-large">
              <h3>{{ selectedDetective.price }}원/협의</h3>
            </div>
          </div>

          <!-- 견적 내용 -->
          <div class="estimate-body">
            <p>{{ selectedDetective.estimate }}</p>
          </div>

          <!-- 하단 버튼 -->
          <div class="actions">
            <button @click="goChat">채팅하기</button>
            <button @click="acceptEstimate">홈즈선택</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detectives: [
        {
          name: "셜록 홈즈",
          price: "123,000",
          estimate: "이 탐정은 매우 경험이 풍부합니다...",
          avatar: "/images/detective.png",
        },
        {
          name: "포와로",
          price: "110,000",
          estimate: "명탐정 포와로는 당신의 사건을 해결할 것입니다...",
          avatar: "/images/detective.png",
        },
        {
          name: "메그레",
          price: "115,000",
          estimate: "프랑스 최고의 형사, 메그레입니다...",
          avatar: "/images/detective.png",
        },
      ],
      selectedDetective: null,
    };
  },
  methods: {
    selectDetective(detective) {
      this.selectedDetective = detective;
    },
    acceptEstimate() {
      alert("견적서를 수락했습니다.");
    },
    goChat() {
      this.$router.push("/chatroom");
    },
  },
  mounted() {
    // detectives 배열의 첫 번째 탐정을 자동으로 선택
    if (this.detectives.length > 0) {
      this.selectedDetective = this.detectives[0];
    }
  },
};
</script>

<style scoped>
.estimate-detail-container {
  /* display: flex; */
}

.estimate-detail {
  display: flex;
  justify-content: center;
  padding: 15px;
  height: 85%;
}

.sidebar {
  width: 25%;
  background-color: #f5f5f5;
  padding: 0px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  cursor: pointer;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #ededed;
  display: flex;
  align-items: center;
}

.sidebar li:hover {
  background-color: #e0e0e0;
}

.detective-name {
  border: 1px solid rgb(208, 206, 206);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  padding: 3px 10px;
  display: flex;
  justify-content: center;
}

.detective-price {
  font-size: 12px;
  margin: 4px 0 0 7px;
}

.main-content {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
}

.detective-info-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detective-avatar-large {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 1px solid #80808059;
  padding: 10px;
  margin-right: 15px;
}

.detective-details-large {
  flex-grow: 1;
}

.detective-name-container {
  display: flex;
  align-items: center;
  gap: 13px;
}

.profile-button {
  background-color: #fdf7b8bf;
  border: 1px solid #e8e37e;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
}

.detective-contact p {
  margin: 0;
}

.detective-price-large {
  text-align: right;
  margin-right: 10px;
}

.estimate-body {
  margin-top: 20px;
  padding: 20px;
  height: 300px;
  background-color: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.actions button {
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

.actions button:hover {
  background-color: #e0e0e0;
}

/* .detective-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.detective-info {
  display: flex;
  align-items: center;
}

.detective-name {
  font-weight: bold;
  display: block;
}

.detective-price {
  color: gray;
}

.main-content {
  width: 75%;
  padding: 20px;
  border: 1px solid #8080803b;
}

.main-content-line {
  border: 1px solid #8080803b;
}

.estimate-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.estimate-body {
  margin-bottom: 20px;
}

.actions button {
  margin-right: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.actions button:hover {
  background-color: #0056b3;
} */
</style>
