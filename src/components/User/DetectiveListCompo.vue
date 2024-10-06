<template>
  <!-- <div class="middle-component"> -->

  <div class="find-container">
    <header class="find-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>홈즈 검색 결과</h2>
      <span class="header-span"></span>
    </header>

    <section class="services">
      <div class="service-card">
        <img src="@/assets/main/service1.png" />
        <div>홈즈의 프로필을 확인하고</div>
        <div>
          마음에 드는 홈즈에게 <strong>직접 의뢰서를 요청</strong>해보세요
        </div>
      </div>
    </section>

    <div class="find-contain">
      <div class="profile-grid">
        <div
          v-for="(detective, index) in detectives"
          :key="index"
          class="profile-card"
        >
          <div class="profile-content">
            <div>
              <img
                :src="`http://localhost:8080/${detective.profilePicture}`"
                alt="Profile Image"
                class="profile-image"
              />
              <div class="btn">
                <button
                  class="request-btn go-profile-btn"
                  @click="goProfile(detective.userId)"
                >
                  프로필 보기
                </button>
                <button
                  class="request-btn"
                  @click="createRequest(detective.userId)"
                >
                  의뢰서 작성
                </button>
              </div>
            </div>
            <div class="profile-details">
              <div class="profile-title">
                <div class="title">
                  <div>홈즈</div>
                  <div>{{ detective.userName }}</div>
                </div>
                <div class="ratings">
                  <div>⭐ {{ detective.averageRating }}</div>
                  <div>⭐ 후기 {{ detective.reviewCount }}</div>
                </div>
              </div>
              <div class="profile-tags">
                <div class="tag">회사명</div>
                <div class="value">{{ detective.company }}</div>

                <div class="tag">활동지역</div>
                <div class="value">{{ detective.location }}</div>

                <div class="tag">전문분야</div>
                <div class="value">
                  <span
                    v-for="(speciality, index) in detective.specialtiesName"
                    :key="index"
                    class="speciality"
                  >
                    {{ speciality }}
                  </span>
                </div>

                <div v-if="detective.description != null">
                  <div class="tag">특이사항</div>
                  <div class="value">
                    {{ detective.description }}
                  </div>
                </div>

                <div class="tag">소개</div>
                <div class="profile-description">
                  <p>{{ detective.introduction }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      location: null,
      specialityId: null,
      detectives: [],
    };
  },
  mounted: async function () {
    try {
      // 쿼리 파라미터 받기
      this.location = this.$route.query.location;
      this.specialityId = this.$route.query.specialityId;

      // 콘솔 로그로 확인
      console.log("Location:", this.location);
      console.log("Speciality ID:", this.specialityId);

      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 다른 탐정 정보를 서버에 전송
      const response = await axios.post(
        "http://3.35.185.10:8080/client/finddetectives",
        {
          location: this.location,
          specialityId: this.specialityId,
        }
      );

      this.detectives = response.data;

      console.log(this.detectives);
    } catch (error) {
      console.log("에러:", error);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goProfile(detectiveId) {
      this.$router.push({ name: "Profile", params: { detectiveId } });
    },
    createRequest(detectiveId) {
      this.$router.push(`/request/${detectiveId}`);
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
  margin: 30px 20px;
}

.services {
  text-align: center;
  margin-top: 20px;
}

.service-card {
  background-color: #c4c2ba17;
  padding: 15px 0;
}

.service-card img {
  height: 110px;
  width: 130px;
}

.service-card div {
  font-size: 14px;
  color: #190404;
  margin: 5px 0;
}

.profile-grid {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.profile-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.profile-card {
  border: 1px solid #ddd;
  padding: 30px 10px 20px 10px;
  border-radius: 10px;
  box-sizing: border-box;
  text-align: center;
}

.profile-image {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  border: 1px solid #8080804d;
}

.profile-details {
  width: 70%;
}

.profile-title {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;
}

.title div:nth-child(1) {
  font-size: 12px !important;
  font-weight: 600;
  border-radius: 20px;
  padding: 2px 10px;
  background-color: #e9e48d8a;
}

.title div:nth-child(2) {
  font-size: 20px;
  font-weight: 600;
}

.title-company {
  font-size: 14px;
  margin-top: 5px;
  font-weight: 600;
  color: #443838;
}

.ratings {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  gap: 8px;
  font-size: 12px;
  color: #888;
}

.profile-tags {
  margin: 15px 0;
}

.tag {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 7px;
  font-size: 14px;
  font-weight: bold;
}

.value {
  background-color: #fff;
  border-radius: 5px;
  padding: 7px 0px;
  margin: 5px;
  font-size: 14px;
  font-family: none !important;
}

.speciality {
  font-size: 12px !important;
  border-radius: 20px;
  padding: 4px 10px;
  background-color: #e9e48d5e;
  margin-right: 7px;
  font-weight: 600;
}

.profile-description {
  border-bottom: 1px solid #80808047;
  border-radius: 0px;
  padding: 0px 10px;
  font-size: 14px;
  color: #555;
  line-height: 23px;
  text-align: left;
}

.profile-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.request-btn {
  width: 100%;
  padding: 10px 10px;
  background-color: #ffdf3e7d;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 600;
}

.request-btn:hover {
  cursor: pointer;
  background-color: #ffdf3eaf;
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
