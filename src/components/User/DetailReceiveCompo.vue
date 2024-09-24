<template>
  <div class="estimate-container">
    <header class="estimate-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>답변서</h2>
      <span class="header-span">홈즈가 보낸 답변서를 비교하기</span>
    </header>

    <div class="request-contain">
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

      <div class="main-content" v-if="selectedDetective">
        <div class="main-content-line">
          <div class="estimate-header">
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

          <div class="estimate-body">
            <p>{{ selectedDetective.description }}</p>
          </div>

          <div class="actions">
            <button @click="goChat()">채팅하기</button>
            <button @click="acceptEstimate">홈즈선택</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  props: ["requestId"],
  data() {
    return {
      estimates: [],
      selectedDetective: null,
    };
  },
  computed: {
    ...mapGetters(["getRoles", "getId"]),
  },
  created() {
    this.getEstimates();
  },
  methods: {
    async getEstimates() {
      console.log(this.requestId);
      try {
        const response = await axios.get("/api/estimate/receivelist", {
          params: {
            requestId: this.requestId,
          },
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
    async goChat() {
      this.token = localStorage.getItem("token"); // 로컬스토리지에서 토큰을 가져옴

      if (this.token) {
        // 토큰이 존재하는 경우, Axios의 Authorization 헤더에 토큰을 추가
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      try {
        const request = await axios.post(`/api/chatroom/create`, null, {
          params: {
            estimateId: this.selectedDetective.estimateId, // 쿼리 파라미터로 estimateId 전달
          },
        });
        // this.messages = response.data;
        this.chatRoom = request.data;
        console.log("ㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎㅎ", this.chatRoom);
      } catch (error) {
        console.error("채팅방 생성 실패", error);
      }
      const chatRoomId = this.chatRoom.id;
      console.log("chatRoomId", chatRoomId);
      this.$router.push({
        name: "ChatRoom",
        params: { chatRoomId: chatRoomId },
      });
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
.estimate-container {
  font-family: Arial, sans-serif;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
}

.estimate-header {
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

.request-contain {
  display: flex;
  justify-content: center;
  height: 94%;
  border-top: 1px solid #8080802e;
  border-bottom: 1px solid #808080;
}

.sidebar {
  width: 30%;
  background-color: #f5f5f5f2;
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
  justify-content: start;
}

.detective-price {
  margin-top: 7px;
  font-size: 15px;
}

.main-content {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-left: 1px solid #cccccc54;
  padding: 30px 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
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
}
</style>
