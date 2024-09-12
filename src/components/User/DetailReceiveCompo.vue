<template>
  <div class="estimate-detail-container">
    <h2>견적서 상세보기</h2>
    <p>홈즈가 보낸 견적서 자세히 보고 비교하기</p>
    <div class="estimate-detail">
      <!-- 사이드 바 -->
      <div class="sidebar">
        <ul>
          <li
            v-for="(estimate, index) in estimates"
            :key="index"
            @click="selectDetective(estimate)"
            :class="{ active: selectedDetective === estimate }"
          >
            <div class="detective-info">
              <div class="detective-details">
                <div class="detective-name">{{ estimate.detectiveName }}</div>
                <div class="detective-price">{{ estimate.price }}원</div>
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
                  src="/images/detective.png"
                  alt="Detective Avatar"
                />
              </div>
              <div class="detective-details-large">
                <div class="detective-name-container">
                  <h3>{{ selectedDetective.detectiveName }}</h3>
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
            <p>{{ selectedDetective.description }}</p>
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
import axios from "axios";

export default {
  props: ["requestId"],
  data() {
    return {
      estimates: [],
      selectedDetective: null,
    };
  },
  created() {
    this.getEstimates();
  },
  methods: {
    async getEstimates() {
      console.log(this.requestId);
      try {
        const response = await axios.get("/api/reply/detail", {
          params: { requestId: this.requestId },
        });
        this.estimates = response.data;
        this.selectedDetective = this.estimates[0];
        console.log(this.estimates);
      } catch (error) {
        return;
      }
    },
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
  // mounted() {
  //   // detectives 배열의 첫 번째 탐정을 자동으로 선택
  //   if (this.estimates.length > 0) {
  //     this.selectedDetective = this.estimates[0];
  //   }
  // },
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
  height: 88%;
  min-height: 600px;
}

.sidebar {
  width: 30%;
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
  justify-content: start;
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
  border-top-left-radius: 10px; /* 왼쪽 위 */
  border-bottom-left-radius: 10px; /* 왼쪽 아래 */
  padding: 20px;
  box-sizing: border-box; /* 패딩과 보더를 포함하여 크기 계산 */
  display: flex;
  flex-direction: column; /* flex 방향을 컬럼으로 설정하여 요소를 위에서 아래로 배치 */
  justify-content: space-between; /* 상하 요소 사이에 공간을 분배 */
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

/* 반응형 디자인: 화면 크기가 줄어들 때의 대응 */
@media screen and (max-width: 768px) {
  .estimate-detail {
    flex-direction: column; /* 작은 화면에서는 사이드바와 콘텐츠가 위아래로 배치 */
  }

  .sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .main-content {
    width: 100%;
  }
}
</style>
