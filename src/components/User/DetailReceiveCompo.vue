<template>
  <div class="estimate-container">
    <header class="estimate-top-header" @click="goBack">
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
            @click="selectDetective(index)"
            :class="{ active: selectedDetective === estimate }"
          >
            <div class="detective-info">
              <div class="detective-details">
                <div class="li-detective-name">
                  {{ estimate.detectiveName }}
                </div>
                <div class="detective-price">
                  {{ estimate.price.toLocaleString() }}원
                </div>
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
                  :src="`http://localhost:8080/${selectedDetective.profileImg}`"
                  alt="Detective Avatar"
                />
              </div>
              <div class="detective-details-large">
                <div class="detective-name-container">
                  <div class="detective-name">
                    {{ selectedDetective.detectiveName }}
                  </div>
                  <button
                    class="profile-button"
                    @click="goProfile(selectedDetective.detectiveId)"
                  >
                    프로필 보기
                  </button>
                </div>
                <div class="detective-contact">
                  <span
                    v-if="
                      selectedDetective.gender === 'MALE' ||
                      selectedDetective.gender === 'Male'
                    "
                  >
                    👤 남자 &nbsp;
                  </span>
                  <span
                    v-else-if="
                      selectedDetective.gender === 'FEMALE' ||
                      selectedDetective.gender === 'Female'
                    "
                  >
                    👤 여자 &nbsp;
                  </span>
                  <span
                    v-else-if="
                      selectedDetective.gender === 'ANY' ||
                      selectedDetective.gender === 'Any'
                    "
                  >
                    👤 전체 &nbsp;</span
                  >
                  <span>📍 {{ selectedDetective.location }} &nbsp; </span>
                  <div class="location">
                    ✔️
                    <span
                      v-for="(name, index) in selectedDetective.speciality"
                      :key="index"
                    >
                      {{ name }} &nbsp;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="estimate-content">
            <label for="title">
              <div class="title">제목</div>
            </label>
            <div class="estimate-title">
              {{ selectedDetective.title }}
            </div>

            <div class="estimate-answer">
              <div class="estimate-answer-together">
                <div class="title">답변일자</div>
                <div class="estimate-title">
                  {{ timeconvert(selectedDetective.createAt) }}
                </div>
              </div>
              <div class="estimate-answer-together">
                <div class="title">답변금액</div>
                <div class="estimate-title">
                  <span>{{ selectedDetective.price.toLocaleString() }}원</span>
                  <span class="estimate-title-span">협의</span>
                </div>
              </div>
            </div>

            <label for="title">
              <div class="title">답변내용</div>
            </label>
            <div class="estimate-body">
              <textarea
                v-model="selectedDetective.description"
                readonly
              ></textarea>
            </div>
          </div>

          <div class="actions">
            <button @click="goChat">채팅하기</button>
            <button v-if="chatRoomExists" @click="acceptEstimate">
              리뷰쓰기
            </button>
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
      chatRoomExists: null,
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
        console.log("estimates", this.estimates);

        // 첫 번째 항목을 기본 선택
        if (this.estimates.length > 0) {
          this.selectedDetective = this.estimates[0];
          this.getChatRoomExists();
        }
      } catch (error) {
        console.log("estimates에러");
        return;
      }
    },
    // 탐정 선택 시 호출되는 메서드
    selectDetective(index) {
      this.selectedDetective = this.estimates[index]; // 선택한 탐정을 설정
      this.getChatRoomExists();
    },

    timeconvert(time) {
      const converttime = new Date(time);
      const year = converttime.getFullYear();
      const month = String(converttime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(converttime.getDate()).padStart(2, "0");
      const hour = String(converttime.getHours()).padStart(2, "0");
      const minute = String(converttime.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
    async goChat() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      try {
        const response = await axios.post(`/api/chatroom/create`, null, {
          params: {
            estimateId: this.selectedDetective.estimateId,
          },
        });
        // this.messages = response.data;
        this.chatRoom = response.data;
        const chatRoomId = this.chatRoom.id;
        console.log("chatRoomId", chatRoomId);
        this.$router.push({
          name: "ChatRoom",
          params: { chatRoomId: chatRoomId },
        });
      } catch (error) {
        console.error("채팅방 생성 실패", error);
      }
    },
    async getChatRoomExists() {
      this.token = localStorage.getItem("token");

      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      try {
        const response = await axios.get(`/api/chatroom/chat-exist`, {
          params: {
            estimateId: this.selectedDetective.estimateId,
          },
        });
        this.chatRoomExists = response.data;
      } catch (error) {
        console.error("채팅방 유무 가져오기 실패", error);
      }
    },
    goProfile(detectiveId) {
      this.$router.push({ name: "Profile", params: { detectiveId } });
    },
  },
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

.estimate-top-header {
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
  padding: 13px 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.sidebar li:hover {
  background-color: #e0e0e0;
}

.sidebar li.active {
  background-color: #fffcfc;
  font-weight: bold !important;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1) !important;
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

.li-detective-name {
  display: flex;
  justify-content: center;
  font-size: 14px;
  min-width: 43px;
  border: 1px solid #8080802e;
  border-radius: 20px;
  background-color: #80808012;
  padding: 2px 7px;
}

.detective-price {
  margin-top: 7px;
  font-size: 14px;
  color: #2f2424;
}

.main-content {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-left: 1px solid #cccccc54;
  padding: 0px 20px;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detective-name {
  font-weight: 600;
  font-size: 20px;
}

.detective-name-container {
  display: flex;
  align-items: center;
  gap: 13px;
}

.detective-contact {
  font-size: 12px;
}

.detective-contact p {
  margin: 0;
}

.profile-button {
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 6px 17px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.detective-price-large {
  background-color: #f9f9f9;
  text-align: right;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 5px 17px;
  font-size: 18px;
}

.estimate-answer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.estimate-answer-together {
  width: 47%;
}

.location {
  margin-top: 5px;
}

.title {
  margin: 10px 0 7px 0;
  font-weight: 600;
  font-size: 14px;
}

.estimate-title {
  background-color: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 10px 14px;
  font-size: 14px;
}

.estimate-title-span {
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 3px 5px;
  border-radius: 20px;
  font-size: 11px;
  margin-left: 5px;
  font-weight: 600;
  cursor: pointer;
}

.estimate-content {
  margin: 20px 0;
}

.estimate-createat {
  text-align: right;
  margin: 14px 0;
  font-size: 13px;
}

.estimate-body {
  padding: 10px 10px;
  height: 230px;
  background-color: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #ddd;
}

textarea {
  border: none;
  resize: none;
  width: 100%;
  height: 210px;
  line-height: 23px;
  font-family: auto;
  font-size: 14px;
  background-color: #80808000;
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  gap: 12px;
}

.actions button {
  padding: 7px 50px;
  width: 100%;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
}

.actions button:hover {
  background-color: #e0e0e086;
}
</style>
