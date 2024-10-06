<template>
  <div class="find-container">
    <header class="find-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>{{ detective.userName }}의 프로필</h2>
      <span class="header-span"></span>
    </header>

    <div class="find-contain">
      <div v-if="detective" class="detective-profile">
        <div class="profile-info">
          <div class="profile-img">
            <img
              v-if="detective.profilePicture"
              :src="getImageUrl(detective.profilePicture)"
              alt="프로필 사진"
            />
          </div>
          <div class="profile-content">
            <p>{{ detective.userName }}</p>
            <div class="profile-content-detail">
              <strong>회사명 </strong> {{ detective.company }}
            </div>
            <div div class="profile-content-detail">
              <div class="description">
                {{ detective.introduction }}
              </div>
            </div>

            <div div class="profile-confirm">
              <span>🏆 사업자등록증 인증 &nbsp; </span>
              <span>🏆 탐정등록증 인증</span>
            </div>
            <button class="request-button" @click="goRequest(detectiveId)">
              의뢰 요청하기
            </button>
          </div>
        </div>

        <div class="detective-details">
          <div class="specialties">
            <h4>전문분야</h4>
            <div class="specialty-tags">
              <span
                v-for="speciality in detective.specialtiesName"
                :key="speciality"
                class="speciality"
              >
                {{ speciality }}
              </span>
            </div>
          </div>

          <div class="locations">
            <h4>업무가능지역</h4>
            <div class="location-tags">
              <span>{{ detective.location }}</span>
            </div>
          </div>

          <div class="locations" v-if="detective.description != null">
            <h4>특이사항(경력사항 등)</h4>
            <div class="special-description">
              <div>{{ detective.description }}</div>
            </div>
          </div>

          <div class="reviews">
            <h4>사용자 후기</h4>
            <div class="review-list">
              <p class="review-summary">
                후기 {{ detective.reviewCount }} 개 ⭐
                {{ detective.averageRating }} / 5.0
              </p>
              <!-- Review list example -->
              <div
                class="review-item"
                v-for="review in reviews"
                :key="review.id"
              >
                <div class="review-header">
                  <div class="header-top">
                    <span class="review-username">익명{{ review.id }}</span>
                    <span class="star-rating"
                      ><star-rating
                        :rating="review.rating"
                        :increment="0.5"
                        :star-size="15"
                        :read-only="true"
                        :show-rating="false"
                        :rounded-corners="true"
                        :max-rating="5"
                      ></star-rating
                    ></span>
                  </div>
                  <p class="review-date">{{ timeconvert(review.updatedAt) }}</p>
                </div>
                <p class="review-content">{{ review.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <p>탐정 정보를 불러오는 중입니다...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import StarRating from "vue-star-rating";

export default {
  props: ["detectiveId"],
  components: {
    StarRating,
  },
  data() {
    return {
      detective: {},
      reviews: {},
    };
  },
  mounted() {
    this.getDetectiveProfile();
    this.getReviewList();
  },
  methods: {
    goBack() {
      this.$router.go(-1); // 뒤로 가기 메서드
    },
    getDetectiveProfile() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .get(`https://findmyholmes.store/detective/${this.detectiveId}`)
        .then((response) => {
          this.detective = response.data;
          console.log(this.detective);
        })
        .catch((error) => {
          console.log("에러:", error);
        });
    },
    getReviewList() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .get(
          `https://findmyholmes.store/review/get/detective/${this.detectiveId}`
        )
        .then((response) => {
          this.reviews = response.data;
          console.log("리뷰 리스트", this.reviews);
        })
        .catch((error) => {
          console.log("에러:", error);
        });
    },
    getImageUrl(path) {
      return `http://localhost:8080/${path}`;
    },
    goRequest(detectiveId) {
      this.$router.push(`/request/${detectiveId}`);
    },
    timeconvert(time) {
      const converttime = new Date(time);
      const year = converttime.getFullYear();
      const month = String(converttime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(converttime.getDate()).padStart(2, "0");
      // const hour = String(converttime.getHours()).padStart(2, "0");
      // const minute = String(converttime.getMinutes()).padStart(2, "0");
      return `${year}년 ${month}월 ${day}일`;
    },
  },
};
</script>

<style scoped>
.find-container {
  font-family: Arial, sans-serif;
}

.find-header {
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

.find-contain {
  margin: 25px 25px;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
}

.profile-header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #ddd;
  padding-bottom: 15px;
  margin-bottom: 30px;
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  margin-right: 10px;
}

.detective-profile {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 30px 16px;
  border-radius: 8px;
  border: 1px solid #80808054;
}

.profile-img {
  width: 30%;
}

.profile-content {
  width: 75%;
}

.profile-img img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid #80808052;
  margin-bottom: 6px;
}

.profile-content p {
  margin-bottom: 9px;
  margin-top: 0px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.profile-content-detail {
  font-size: 16px;
  margin-bottom: 8px;
  text-align: center;
}

.description {
  padding: 18px 0px;
  font-size: 14px;
  color: #070505f7;
  line-height: 29px;
  text-align: left;
  border-top: 1px solid #80808070;
  border-bottom: 1px solid #80808070;
  margin: 20px 0;
}

.profile-confirm {
  display: flex;
  justify-content: space-evenly;
  color: #ecb900;
  gap: 9px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.request-button {
  margin-top: 30px;
  width: 100%;
  padding: 12px 10px;
  background-color: #ffdf3e9c;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  color: black;
  font-weight: 600;
}

.request-button:hover {
  background-color: #ffdf3ec7;
  cursor: pointer;
}

.detective-details {
  margin-top: 30px;
}

.specialties,
.locations {
  margin-bottom: 60px;
}

.reviews {
  margin-top: 90px;
}

.specialties h4,
.locations h4,
.reviews h4 {
  font-size: 18px;
  margin-bottom: 17px;
  color: #3c3737;
}

.specialty-tags,
.location-tags {
  display: flex;
  flex-wrap: wrap;
}

.specialty-tags span,
.location-tags span {
  background-color: #f5f5f5;
  padding: 12px 19px;
  margin-right: 12px;
  margin-bottom: 10px;
  border-radius: 20px;
  font-size: 14px;
}

.special-description {
  background-color: #f5f5f5;
  padding: 25px 20px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 28px;
}

.review-list {
  margin-top: 10px;
}

.review-summary {
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
  text-align: end;
}

.review-item {
  padding: 20px 20px;
  background-color: #8080800d;
  border-radius: 16px;
  margin-bottom: 17px;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  flex-direction: column; /* 상단과 하단을 구분 */
}

.header-top {
  display: flex;
  align-items: center;
  margin-bottom: -3px;
}

.review-username {
  font-weight: bold;
  font-size: 14px;
  color: #000;
  margin-right: 10px;
}

.star-rating {
  color: #ffd900;
  font-size: 13px;
}

.review-date {
  font-size: 12px;
  color: #77777791;
  margin-top: 0px;
  text-align: end;
}

.review-content {
  font-size: 14px;
  line-height: 24px;
  color: #333;
  margin: 0px;
  padding: 7px 0;
  width: 98%;
}

.review-item:last-child .review-content {
  margin-bottom: 0;
}

@media screen and (max-width: 768px) {
  .detective-profile {
    flex-direction: column;
  }

  .profile-info,
  .detective-details {
    max-width: 100%;
    margin-bottom: 20px;
  }
}

/* 태블릿 화면 (최대 너비 768px) */
@media screen and (max-width: 768px) {
  .profile-content {
    align-items: center;
  }

  .profile-details {
    width: 75%;
  }

  .profile-image {
    height: 80px;
    width: 80px;
  }

  .find-header h2 {
    font-size: 14px;
  }

  .btn {
    margin-top: 8px;
    margin-bottom: 15px;
    display: flex;
    gap: 10px;
    flex-direction: column;
  }

  .request-btn {
    padding: 8px 8px;
    font-size: 10px;
  }

  .profile-card {
    padding: 15px 5px;
  }

  .profile-description {
    font-size: 10px;
    padding: 0px 12px;
    line-height: 16px;
    border-bottom: none;
  }
}

/* 작은 모바일 화면 (최대 너비 480px) */
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

  .profile-image {
    height: 60px;
    width: 60px;
  }

  .title div:nth-child(1) {
    font-size: 10px;
  }

  .title div:nth-child(2) {
    font-size: 14px;
  }

  .ratings {
    font-size: 10px;
  }

  .tag {
    font-size: 10px;
    padding: 3px 7px;
  }

  .value {
    font-size: 10px;
  }

  .speciality {
    font-size: 10px;
    padding: 2px 5px;
  }

  .profile-description {
    font-size: 10px;
    padding: 0px 12px;
    line-height: 16px;
    border-bottom: none;
  }

  .btn .request-btn {
    padding: 5px 7px;
    font-size: 10px;
  }

  .find-contain {
    margin: 25px 7px;
  }

  .profile-card {
    padding: 15px 3px 5px 3px;
  }
}
</style>
