<template>
  <div class="estimate-detail-container">
    <div>
      <h2>답변서</h2>
      <p>홈즈가 보낸 답변서를 비교하기</p>
    </div>
    <div class="estimate-detail">
      <div class="sidebar">
        <ul>
          <li
            v-for="(detective, index) in detectives"
            :key="index"
            @click="selectDetective(detective)"
            :class="{ active: selectedDetective === detective }"
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

      <div class="main-content" v-if="selectedDetective">
        <div class="main-content-line">
          <div class="estimate-header">
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
                  <button class="profile-button">홈즈의 프로필</button>
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
          name: "포와로",
          price: "110,000",
          estimate: "명탐정 포와로는 당신의 사건을 해결할 것입니다...",
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
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding-top: 20px;
  box-sizing: border-box;
}

h2 {
  text-align: center;
  margin-bottom: -10px;
}

p {
  text-align: center;
  color: #666;
  font-size: 13px;
  margin-bottom: 30px;
}

.estimate-detail {
  display: flex;
  justify-content: center;
  height: 86%;
  min-height: 620px;
}

.sidebar {
  width: 30%;
  border-top: 1px solid #8080801c;
  border-bottom: 1px solid #8080801c;
  background-color: #f5f5f5;
  padding: 0px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  cursor: pointer;
  padding: 10px 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.sidebar li:hover {
  background-color: #e0e0e0;
}
.sidebar li.active {
  background-color: white; /* 선택된 항목의 배경색 */
  font-weight: bold; /* 선택된 항목의 텍스트 강조 */
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); /* 선택된 항목에 그림자 추가 */
  border-top-right-radius: 10px; /* 왼쪽 위 */
  border-bottom-right-radius: 10px; /* 왼쪽 아래 */
}

.detective-name {
  display: flex;
  /* justify-content: center; */
}

.detective-price {
  margin-top: 7px;
  font-size: 15px;
}

.main-content {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border: 1px solid #cccccc99;
  padding: 30px 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  background-color: #efe7945e;
  border: 1px solid #d3cb3a5e;
  padding: 6px 17px;
  border-radius: 20px;
  font-size: 12px;
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

/* 반응형 디자인: 화면 크기가 줄어들 때의 대응 */
@media screen and (max-width: 768px) {
  .estimate-detail {
    flex-direction: column; /* 작은 화면에서는 사이드바와 콘텐츠가 위아래로 배치 */
  }

  .sidebar {
    width: 100%;
  }

  .main-content {
    width: 100%;
  }
}
</style>
