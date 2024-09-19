<template>
  <div>
    <div v-if="imagePaths.businessRegistrationPath" @click="showModal('businessRegistrationPath')">
      <h1>Business Registration</h1>
      <img
        :src="getImageUrl(imagePaths.businessRegistrationPath)"
        alt="Business Registration"
        class="thumbnail"
      />
    </div>
    <div v-if="imagePaths.detectiveLicensePath" @click="showModal('detectiveLicensePath')">
      <h1>Detective License</h1>
      <img
        :src="getImageUrl(imagePaths.detectiveLicensePath)"
        alt="Detective License"
        class="thumbnail"
      />
    </div>
    <div v-if="imagePaths.profilePicturePath" @click="showModal('profilePicturePath')">
      <h1>Profile Picture</h1>
      <img
        :src="getImageUrl(imagePaths.profilePicturePath)"
        alt="Profile Picture"
        class="thumbnail"
      />
    </div>
    <div v-if="!imagePaths.profilePicturePath">
      <h3>프로필사진 추가</h3>
      <div class="form-group">
        <label for="profile_picture">Profile Picture:</label>
        <input
            @change="handleFileChange('profilePictureFile', $event)" 
            type="file" 
            id="profile_picture" 
        />
      </div>
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

    <!-- 이미지 모달 -->
    <div v-if="isModalVisible" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <img :src="getImageUrl(imagePaths[selectedImagePath])" alt="Full Size Image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

// 상태 변수
const profilePictureFile = ref(null);
const additionalCertification = ref(null);
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

// 모달 관련 상태
const isModalVisible = ref(false);
const selectedImagePath = ref("");

const handleFileChange = (fileType, event) => {
  const file = event.target.files[0];
  if (fileType === 'profilePictureFile') profilePictureFile.value = file;
  if (fileType === 'additionalCertification') additionalCertification.value = file;
};

// 데이터 가져오기
onMounted(() => {
  test(); // 자동으로 데이터 가져오기
});

// 데이터 가져오기 함수
const test = async () => {
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  try {
    const response = await axios.get("/api/detective/getDetectiveDetail");
    const data = response.data;
    createdAt.value = data.createdAt;
    currentPoints.value = data.currentPoints;
    gender.value = data.detectiveGender;
    email.value = data.email;
    introduction.value = data.introduction;
    location.value = data.location;
    phoneNumber.value = data.phoneNumber;
    resolvedCases.value = data.resolvedCases;
    userName.value = data.userName;

    imagePaths.value.businessRegistrationPath = data.businessRegistration;
    imagePaths.value.detectiveLicensePath = data.detectiveLicense;
    imagePaths.value.profilePicturePath = data.profilePicture;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// 이미지 URL 반환 함수
const getImageUrl = (path) => {
  return `http://localhost:8080/${path}`;
};

// 모달 열기 함수
const showModal = (imagePathKey) => {
  selectedImagePath.value = imagePathKey;
  isModalVisible.value = true;
};

// 모달 닫기 함수
const closeModal = () => {
  isModalVisible.value = false;
};
</script>

<style scoped>

.form-group {
  margin-bottom: 15px;
}

/* 이미지 스타일 */
.thumbnail {
  width: 200px;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
}

/* 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  /* left: 0; */
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  z-index: 1000;
}

.modal-content {
  max-width: 80%;
  max-height: 80%;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content img {
  max-width: 100%;
  max-height: 100%;
}

/* 모달 닫기 방지 (모달 내용 클릭 시 모달 닫히는 문제 방지) */
.modal-content {
  position: relative;
}
</style>
