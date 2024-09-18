<template>
  <div>
    <button @click="test">가져오기</button>
    <div v-if="imagePaths.businessRegistrationPath">
      <h2>Business Registration</h2>
      <img
        :src="getImageUrl(imagePaths.businessRegistrationPath)"
        alt="Business Registration"
      />
    </div>
    <div v-if="imagePaths.detectiveLicensePath">
      <h2>Detective License</h2>
      <img
        :src="getImageUrl(imagePaths.detectiveLicensePath)"
        alt="Detective License"
      />
    </div>
    <div v-if="imagePaths.profilePicturePath">
      <h2>Profile Picture</h2>
      <img
        :src="getImageUrl(imagePaths.profilePicturePath)"
        alt="Profile Picture"
      />
    </div>
    <h3>가입일 {{ createdAt }}</h3>
    <h3>포인트 {{ currentPoints }}</h3>
    <h3>성별 {{ gender }}</h3>
    <h3>이메일 {{ email }}</h3>
    <h3>소개 {{ introduction }}</h3>
    <h3>지역 {{ location }}</h3>
    <h3>전화번호 {{ phoneNumber }}</h3>
    <h3>해결한 사건 {{ resolvedCases }}</h3>
    <h3>이름 {{ userName }}</h3>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const createdAt = ref("");
const currentPoints = ref("");
const gender = ref("");
const email = ref("");
const introduction = ref("");
const location = ref("");
const phoneNumber = ref("");
const resolvedCases = ref("");
const userName = ref("");
const imagePaths = ref({
  businessRegistrationPath: null,
  detectiveLicensePath: null,
  profilePicturePath: null,
});

// 데이터 가져오기 함수
const test = async () => {
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  try {
    const response = await axios.get("/api/detective/getDetectiveDetail");
    console.log(response.data);
    createdAt.value = response.data.createdAt;
    currentPoints.value = response.data.currentPoints;
    gender.value = response.data.detectiveGender;
    email.value = response.data.email;
    introduction.value = response.data.introduction;
    location.value = response.data.location;
    phoneNumber.value = response.data.phoneNumber;
    resolvedCases.value = response.data.resolvedCases;
    userName.value = response.data.userName;

    imagePaths.value.businessRegistrationPath =
      response.data.businessRegistration;
    imagePaths.value.detectiveLicensePath = response.data.detectiveLicense; // 오타 수정
    imagePaths.value.profilePicturePath = response.data.profilePicture;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const getImageUrl = (path) => {
  // 서버의 호스트 주소를 기준으로 이미지 URL을 반환
  console.log(`http://localhost:8080/${path}`);
  return `http://localhost:8080/${path}`;
};
</script>

<style></style>
