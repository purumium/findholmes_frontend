<template>
  <div class="middle-component">
    <div>
      <h2>홈즈 검색 결과</h2>
      <p>홈즈의 프로필을 확인하기</p>
    </div>

    <div class="profile-grid">
      <div
        v-for="(detective, index) in detectives"
        :key="index"
        class="profile-card"
      >
        <div class="profile-content">
          <img
            :src="detective.profilePicture"
            alt="Profile Image"
            class="profile-image"
          />
          <div class="profile-details">
            <div class="profile-title">
              <div class="title">
                <div>홈즈</div>
                <div>{{ detective.userName }}</div>
              </div>
              <div class="title-company">{{ detective.company }}</div>
              <div class="ratings">
                <div>⭐ {{ detective.rate }}%</div>
                <div>⭐후기 {{ detective.reviews }}건</div>
              </div>
            </div>
            <div class="profile-tags">
              <div class="tag">활동지역</div>
              <div class="value">{{ detective.location }}</div>

              <div class="tag">전문분야</div>
              <div class="value">{{ detective.specialtiesName }}</div>

              <div class="tag">특이사항</div>
              <div class="value">{{ detective.speciality }}</div>
            </div>
          </div>
        </div>
        <div class="profile-description">
          <p>{{ detective.introduction }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      location:null,
      specialityId: null,
      detectives:[],
    };
  },
  mounted: async function() {
    try {
      // 쿼리 파라미터 받기
      this.location = this.$route.query.location;
      this.specialityId = this.$route.query.specialityId;

      // 콘솔 로그로 확인
      console.log('Location:', this.location);
      console.log('Speciality ID:', this.specialityId);

      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 다른 탐정 정보를 서버에 전송
      const response = await axios.post('/api/client/finddetectives', {
        location: this.location,
        specialityId: this.specialityId
      });

      this.detectives = response.data;
      console.log(this.detectives)
      for(let i =0;i<this.detectives.length;i++){
        if (this.detectives[i].profilePicture === null) {
          this.detectives[i].profilePicture = require("@/assets/detective.png"); // 기본 이미지 경로
        }else{
          this.detectives[i].profilePicture = `http://localhost:8080/${this.detectives[i].profilePicture}`
        }
      }
      console.log(this.detectives);

    } catch (error) {
      console.log("에러:", error);
    }
  },

};
</script>

<style scoped>
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

.profile-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.profile-content {
  /* display: flex; */
  /* align-items: flex-start; */
}

.profile-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  width: 46%; /* 두 개씩 배치되도록 설정 */
  box-sizing: border-box;
  text-align: center;
}

.profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 15px;
}

.profile-title {
  margin-bottom: 10px;
}

.title {
  display: flex;
  justify-content: center;
  gap: 3px;
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
  margin: 5px;
  font-size: 12px;
  font-weight: bold;
}

.value {
  background-color: #fff;
  border-radius: 5px;
  padding: 5px 0px;
  margin: 5px;
  font-size: 12px;
  /* border: 1px solid #ddd; */
}

.profile-description {
  margin-top: 15px;
  font-size: 13px;
  color: #555;
}
</style>
