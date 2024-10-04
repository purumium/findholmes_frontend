<template>
  <h2>리뷰작성하기</h2>
  <div class="star-rating-container">
    <span class="rating-text">별점을 매겨주세요</span>
    <star-rating
      v-model:rating="rating"
      :increment="0.5"
      :star-size="30"
      required
      :rounded-corners="true"
    ></star-rating>
    <p>현재 선택된 별점: {{ rating }}</p>
  </div>
  <textarea v-model="content" placeholder="리뷰를 입력하세요"></textarea>
  <button class="write-button" @click="write">작성완료</button>
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
    };
  },
  mounted() {
    console.log("탐정id", this.detectiveId);
    console.log("답변서id", this.estimateId);
  },

  methods: {
    async write() {
      this.token = localStorage.getItem("token");
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      try {
        const response = await axios.post(`/api/review/write`, {
          detectiveId: this.detectiveId,
          rating: this.rating,
          content: this.content,
          estimateId: this.estimateId,
        });
        console.log("내가 보낸 리뷰데이터", response.data);

        // 탐정 프로필 들어가서 리뷰 들어가서 확인하기
        this.$router.push({
          name: "Profile",
          params: { detective: this.detectiveId },
        });
      } catch (error) {
        console.error("리뷰 생성 실패", error);
      }
    },

    // goToProfile() {},
  },
};
</script>

<style scoped></style>
