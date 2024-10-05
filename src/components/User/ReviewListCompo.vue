<template>
  <div class="review-container">
    <header class="review-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>나의 리뷰 보기</h2>
    </header>

    <div class="review-contain">
      <!-- <div>리뷰 보기</div> -->
      <div class="review-item" v-for="review in reviews" :key="review.id">
        <div class="review-top">
          <span class="review-info">
            ✍️ {{ review.detectiveName }} 's [ {{ review.estimateTitle }} ] 에
            대한 리뷰입니다.
          </span>
          <p class="review-rating">
            <star-rating
              :rating="review.rating"
              :increment="0.5"
              :star-size="20"
              :read-only="true"
              :show-rating="false"
              :rounded-corners="true"
              :max-rating="5"
            ></star-rating>
          </p>
        </div>
        <p class="review-date">{{ timeconvert(review.updatedAt) }}</p>
        <p class="review-content">{{ review.content }}</p>
        <div class="review-actions">
          <button class="openEditModal" @click="openModal(review.id)">
            수정
          </button>
          <button @click="deleteReview(review.id)" class="delete-button">
            삭제
          </button>
        </div>

        <!-- 모달시작 -->
        <div v-if="isModalOpen" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h2>리뷰 수정하기</h2>
              <button @click="closeModal" class="close-button">X</button>
            </div>

            <!-- 별점 입력 -->
            <div class="star-rating">
              <star-rating
                v-model:rating="rating"
                :increment="0.5"
                :star-size="40"
                required
                :rounded-corners="true"
              ></star-rating>
            </div>

            <!-- 리뷰 내용 입력 -->
            <textarea v-model="content"></textarea>

            <!-- 수정 버튼 -->
            <button @click="editReview" class="edit-button">수정하기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";
export default {
  components: {
    StarRating,
  },
  data() {
    return {
      reviews: {},
      isModalOpen: false,
      rating: 0,
      content: "",
      eachReview: {
        // 수정할 리뷰 데이터
        id: null,
        detectiveId: null,
        estimateId: null,
      },
    };
  },
  mounted() {
    this.getMyReviewList();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getMyReviewList() {
      this.token = localStorage.getItem("token");
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      try {
        const response = await axios.get(`/api/review/get/myReview`);
        this.reviews = response.data;
        console.log("~~~~~~~~~~~", this.reviews);
      } catch (error) {
        console.error("내 리뷰 불러오기 실패:", error);
      }
    },
    timeconvert(time) {
      const converttime = new Date(time);
      const year = converttime.getFullYear();
      const month = String(converttime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(converttime.getDate()).padStart(2, "0");
      const hour = String(converttime.getHours()).padStart(2, "0");
      const minute = String(converttime.getMinutes()).padStart(2, "0");
      return `${year}년 ${month}월 ${day}일 ${hour}:${minute}`;
    },
    async editReview() {
      this.token = localStorage.getItem("token");
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      const dataToSend = {
        id: this.eachReview.id,
        detectiveId: this.eachReview.detectiveId,
        rating: this.rating,
        content: this.content,
        estimateId: this.eachReview.estimateId,
      };

      // 서버로 보내기 전에 데이터를 console에 출력
      console.log("서버로 보낼 데이터:", dataToSend);
      try {
        const response = await axios.post(`/api/review/update`, {
          id: this.eachReview.id,
          detectiveId: this.eachReview.detectiveId,
          rating: this.rating,
          content: this.content,
          estimateId: this.eachReview.estimateId,
        });
        console.log(response.data);
        alert("리뷰가 성공적으로 수정되었습니다.");
        this.closeModal(); // 수정 후 모달 닫기
        this.getMyReviewList();
      } catch (error) {
        console.error("내 리뷰 수정 실패:", error);
      }
    },
    deleteReview(reviewId) {
      this.token = localStorage.getItem("token");
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      alert("정말 삭제하시겠습니까?");
      axios
        .delete(`/api/review/delete/${reviewId}`)
        .then((response) => {
          if (response.status === 204) {
            alert("삭제가 성공적으로 완료되었습니다."); // 삭제 성공 메시지
          }
          this.getMyReviewList();
        })
        .catch((error) => {
          console.error("삭제 요청 중 오류 발생:", error);
          alert("삭제에 실패했습니다."); // 삭제 실패 메시지
        });
    },
    openModal(reviewId) {
      this.isModalOpen = true;
      // 기존 리뷰 데이터를 불러오는 함수 호출
      this.fetchEachReviewData(reviewId);
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async fetchEachReviewData(reviewId) {
      this.token = localStorage.getItem("token");
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }
      await axios
        .get(`/api/review/get/${reviewId}`)
        .then((response) => {
          const eachReview = response.data;
          console.log("각 리뷰 값: ", eachReview);
          this.eachReview = {
            id: eachReview.id,
            detectiveId: eachReview.detectiveId,
            estimateId: eachReview.estimateId,
          };
          this.rating = eachReview.rating; // 기존 리뷰의 별점
          this.content = eachReview.content; // 기존 리뷰의 내용
        })
        .catch((error) => {
          console.error("리뷰 데이터를 불러오는 중 오류 발생:", error);
        });
    },
  },
};
</script>

<style scoped>
.review-container {
  font-family: Arial, sans-serif;
}

.review-header {
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

.review-contain {
  margin: 20px auto;
  width: 80%;
  max-width: 600px;
  font-family: Arial, sans-serif;
}

.review-item {
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.review-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 5px;
}

.review-info {
  font-size: 12px;
  margin-left: 10px;
  margin-right: 60px;
}

.review-rating {
  font-size: 18px;
  color: #ffd700;
  margin-right: 5px;
}

.review-date {
  font-size: 12px;
  color: #777;
}

.review-content {
  font-size: 14px;
  margin-left: 10px;
  margin-bottom: 15px;
  line-height: 1.6;
  color: #333;
}

.review-actions {
  display: flex;
  justify-content: flex-end;
}

.review-actions button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
}

.openEditModal {
  background-color: #4caf50;
  color: white;
  margin-right: 10px;
}

.openEditModal:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #d32f2f;
}

/* 모달 오버레이 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 모달 창 스타일 */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0px 0px 10px;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

textarea {
  width: 90%;
  height: 100px;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
}

.edit-button {
  background-color: #f6d365;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 12px;
}

.edit-button:hover {
  background-color: #e6b733;
}

.star-rating {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
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
