<template>
  <div class="review-container">
    <h2>리뷰 작성하기</h2>
    <div class="review-info-container">
      <p class="info-title">🖋️ 내 의뢰 | {{ info.requestTitle }}</p>
      <p class="info-title">📝 홈즈 견적 | {{ info.estimateTitle }}</p>
      <p class="info-title">🕵️ 홈즈 이름 | {{ info.detectiveName }}</p>
    </div>
    <div class="star-rating-container">
      <span class="rating-text">홈즈에 대해 만족하셨나요?</span>
      <star-rating
        v-model:rating="rating"
        :increment="0.5"
        :star-size="30"
        required
        :rounded-corners="true"
      ></star-rating>
      <!-- <p class="selected-rating">현재 선택된 별점: {{ rating }}</p> -->
    </div>

    <textarea
      v-model="content"
      class="review-textarea"
      placeholder="리뷰를 입력하세요"
    >
    </textarea>

    <button class="write-button" @click="write">작성 완료</button>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";

export default {
  components: {
    StarRating,
  },
  props: ["detectiveId", "estimateId"],
  data() {
    return {
      rating: 0,
      content: "",
      info: {},
    };
  },
  mounted() {
    console.log("탐정id", this.detectiveId);
    console.log("답변서id", this.estimateId);
    this.getInfo();
  },

  methods: {
    async getInfo() {
      this.token = localStorage.getItem("token");
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      try {
        const response = await axios.get(
          `http://3.35.185.10:8080/review/info/${this.estimateId}`
        );
        this.info = response.data;
        console.log("답변서 정보: ", this.info);
      } catch (error) {
        console.error("채팅방 정보 가져오는 중 오류 발생", error);
      }
    },
    async write() {
      this.token = localStorage.getItem("token");
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      if (!this.content) {
        alert("리뷰 내용을 작성해주세요");
      } else {
        try {
          const response = await axios.post(
            `http://3.35.185.10:8080/review/write`,
            {
              detectiveId: this.detectiveId,
              rating: this.rating,
              content: this.content,
              estimateId: this.estimateId,
            }
          );
          console.log("내가 보낸 리뷰데이터", response.data);

          // 탐정 프로필 들어가서 리뷰 들어가서 확인하기
          this.$router.push({
            name: "Profile",
            params: { detective: this.detectiveId },
          });
        } catch (error) {
          console.error("리뷰 생성 실패", error);
        }
      }
    },

    // goToProfile() {},
  },
};
</script>

<style scoped>
.review-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: left;
  color: #333;
  margin-bottom: 20px;
}

.review-info-container {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.info-title {
  font-size: 14px;
  color: #666;
  margin: 2px 0;
}

.star-rating-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.rating-text {
  font-size: 18px;
  margin-bottom: 10px;
  color: #555;
}

.selected-rating {
  margin-top: 10px;
  font-size: 16px;
  color: #777;
}

.review-textarea {
  width: 95%;
  height: 200px;
  padding: 10px;
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  font-size: 16px;
  line-height: 1.5;
}

.review-textarea:focus {
  border-color: #ffdf3e9c;
  outline: none;
  box-shadow: 0 0 5px rgba(233, 220, 102, 0.5);
}

.write-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #ffdf3e9c;
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.write-button:hover {
  background-color: #d3b8339c;
}

.write-button:focus {
  outline: none;
}
</style>
