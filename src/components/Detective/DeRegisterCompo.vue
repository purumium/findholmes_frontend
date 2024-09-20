<template>
  <div class="find-container">
    <header class="find-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>홈즈 등록하기</h2>
      <span class="header-span"></span>
    </header>

    <section class="services">
      <div class="service-card">
        <img src="@/assets/main/service1.png" />
        <div>찾아줘 홈즈를 이용하기 전에</div>
        <div>홈즈 등록을 먼저 진행해주세요</div>
      </div>
    </section>

    <div v-if="selectedDiv === '1'" class="register-container">
      <div class="register-form" id="1">
        <div class="register-logo"></div>
        <form @submit.prevent="handleSubmit">
          <!-- 탐정 등록-->
          <div class="form-group">
            <label for="detective_gender">성별</label>
            <select v-model="detectiveGender" id="detective_gender" required>
              <option value="" disabled>홈즈의 성별을 선택해주세요</option>
              <option value="Male">남자</option>
              <option value="Female">여자</option>
            </select>
          </div>
          <div class="form-group">
            <label for="location">활동지역</label>
            <select v-model="location" id="location" required>
              <option value="" disabled>활동지역을 선택해주세요</option>
              <option value="서울특별시">서울특별시</option>
              <option value="인천광역시">인천광역시</option>
              <option value="강원도">강원도</option>
              <option value="충청북도">충청북도</option>
              <option value="충청남도(대전,세종)">충청남도(대전, 세종)</option>
              <option value="전라북도">전라북도</option>
              <option value="전라남도(광주)">전라남도(광주)</option>
              <option value="경상북도(대구)">경상북도(대구)</option>
              <option value="경상남도(부산,울산)">경상남도(부산, 울산)</option>
              <option value="제주특별자치도">제주특별자치도</option>
            </select>
          </div>
          <div class="form-group">
            <label for="introduction">자기소개</label>
            <textarea v-model="introduction" id="introduction" required>
            </textarea>
          </div>
          <div class="form-group">
            <label for="company">회사명(사업자명)</label>
            <input v-model="company" id="company" required />
          </div>
          <div class="form-group">
            <label for="business_registration">사업자등록증</label>
            <input
              @change="handleFileChange('businessRegistrationFile', $event)"
              type="file"
              id="business_registration"
              required
            />
          </div>
          <div class="form-group">
            <label for="detective_license">탐정자격증</label>
            <input
              @change="handleFileChange('detectiveLicenseFile', $event)"
              type="file"
              id="detective_license"
              required
            />
          </div>
          <div class="form-group">
            <label for="profile_picture">프로필사진</label>
            <input
              @change="handleFileChange('profilePictureFile', $event)"
              type="file"
              id="profile_picture"
              required
            />
          </div>
          <div class="form-group">
            <label for="additional_certifications"
              >추가 등록사항(경력 사항 등)</label
            >
            <input
              @change="handleFileChange('additionalCertificationsFile', $event)"
              type="file"
              id="additional_certifications"
            />
          </div>
          <div class="form-group">
            <label for="description">추가 설명</label>
            <textarea v-model="description" id="description"> </textarea>
          </div>
          <div class="form-group">
            <label for="specialties">전문분야(여러 개 선택 가능)</label>
            <div class="specialty-container">
              <select v-model="selectedSpecialty" id="specialties">
                <option value="" disabled>전문분야를 선택해주세요</option>
                <option
                  v-for="specialty in specialties"
                  :key="specialty.specialityId"
                  :value="specialty"
                >
                  {{ specialty.specialityName }}
                </option>
              </select>
              <button type="button" @click="addSpecialty">추가</button>
            </div>
          </div>
          <div v-if="selectedSpecialties.length" class="selectedSpecialities">
            <h5>선택된 전문분야</h5>
            <ul>
              <li
                v-for="specialty in selectedSpecialties"
                :key="specialty.specialityId"
              >
                {{ specialty.specialityName }}
                <button
                  type="button"
                  @click="removeSpecialty(specialty.specialityId)"
                >
                  삭제
                </button>
              </li>
            </ul>
          </div>
          <div class="button-group">
            <button type="submit" class="btn-register">등록하기</button>
          </div>
        </form>
        <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">
          {{ message }}
        </p>
      </div>
    </div>
    <div v-if="selectedDiv === '2'" id="2">
      <h1>승인 대기중</h1>
    </div>
    <div v-if="selectedDiv === '3'" id="3">
      <h1>이미 승인되었습니다</h1>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const businessRegistrationFile = ref(null);
const detectiveLicenseFile = ref(null);
const profilePictureFile = ref(null);
const additionalCertificationsFile = ref(null);
const introduction = ref("");
const location = ref("");
const company = ref("");
const description = ref("");
const detectiveGender = ref("");
const resolvedCases = ref(0);
const selectedSpecialties = ref([]);
const selectedSpecialty = ref(null);
const message = ref("");
const specialties = ref([]);
const isSuccess = ref(false);
const selectedDiv = ref("");
const checkReg = ref("");
const router = useRouter();

// 페이지가 마운트된 후, 선택된 div 설정 및 전문 분야 가져오기
onMounted(() => {
  checkDeRegister();
  fetchSpecialties();
});

// 파일이 선택되었을 때 해당 파일 객체를 저장
const handleFileChange = (fileType, event) => {
  const file = event.target.files[0];
  if (fileType === "businessRegistrationFile")
    businessRegistrationFile.value = file;
  if (fileType === "detectiveLicenseFile") detectiveLicenseFile.value = file;
  if (fileType === "profilePictureFile") profilePictureFile.value = file;
  if (fileType === "additionalCertificationsFile")
    additionalCertificationsFile.value = file;
};

const handleSubmit = async () => {
  const specialtyIds = selectedSpecialties.value.map((s) => s.specialityId);
  try {
    // 1. 파일을 FormData에 담아 서버에 전송하고, 저장된 파일 경로를 받음
    const formData = new FormData();
    formData.append("businessRegistration", businessRegistrationFile.value);
    formData.append("detectiveLicense", detectiveLicenseFile.value);
    formData.append("profilePicture", profilePictureFile.value);
    formData.append(
      "additionalCertifications",
      additionalCertificationsFile.value
    );

    const fileUploadResponse = await axios.post(
      "/api/detective/files",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const {
      businessRegistrationPath,
      detectiveLicensePath,
      profilePicturePath,
      additionalCertificationsPath,
    } = fileUploadResponse.data;

    console.log("fileUploadResponse.data : " + fileUploadResponse.data);

    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // 2. 다른 탐정 정보를 서버에 전송
    const response = await axios.post("/api/detective/register", {
      businessRegistration: businessRegistrationPath,
      detectiveLicense: detectiveLicensePath,
      profilePicture: profilePicturePath,
      additionalCertifications: additionalCertificationsPath,
      introduction: introduction.value,
      location: location.value,
      description: description.value,
      company: company.value,
      detectiveGender: detectiveGender.value,
      resolvedCases: resolvedCases.value,
      specialties: specialtyIds,
    });
    console.log(response);

    message.value = "탐정 등록이 완료되었습니다.";

    alert(message.value);
    router.push("/detective/mypage");
  } catch (error) {
    message.value =
      "Registration failed: " + (error.response?.data || error.message);
    isSuccess.value = false;
  }
};

const checkDeRegister = async () => {
  try {
    const response = await axios.get("/api/detective/checkregister");
    checkReg.value = 1;
    console.log(response.data);
    if (response.data === "PENDING") {
      selectedDiv.value = "2";
    } else if (response.data === "REJECTED") {
      selectedDiv.value = "1";
    } else if (response.data === "APPROVED") {
      selectedDiv.value = "3";
    } else if (response.data === "NO") {
      selectedDiv.value = "1";
    }
  } catch (error) {
    message.value = "Failed to load specialties.";
  }
};

const fetchSpecialties = async () => {
  try {
    const response = await axios.get("/api/detective/specialties");
    specialties.value = response.data;
  } catch (error) {
    message.value = "Failed to load specialties.";
  }
};

const addSpecialty = () => {
  if (
    selectedSpecialty.value &&
    !selectedSpecialties.value.some(
      (s) => s.specialityId === selectedSpecialty.value.specialityId
    )
  ) {
    selectedSpecialties.value.push(selectedSpecialty.value);
    selectedSpecialty.value = null;
  }
};

const removeSpecialty = (specialtyId) => {
  selectedSpecialties.value = selectedSpecialties.value.filter(
    (s) => s.specialityId !== specialtyId
  );
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
  margin: 25px 20px;
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
  /* margin-bottom: 10px; */
  height: 110px;
  width: 130px;
}

.service-card div {
  font-size: 13px;
  color: #190404;
  margin: 5px 0;
}

.register-container {
  padding: 20px 20px 30px 20px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  border: 1px solid #80808054;
  margin: 20px;
}

.register-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 13px;
  font-weight: bold;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

textarea {
  resize: none;
  height: 100px;
}

.btn-register {
  display: block;
  width: 100%;
  padding: 12px 10px;
  background-color: #ffdf3e9c;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  color: black;
}

.btn-register:hover {
  background-color: #ffdf3ed0;
}

.button-group {
  text-align: center;
  margin-top: 35px;
}

.specialty-container {
  display: flex;
  align-items: center; /* 수직으로 가운데 정렬 */
  gap: 10px; /* select와 버튼 사이의 간격 */
}

.specialty-container select {
  flex: 1; /* select가 가능한 한 넓게 차지하게 함 */
}

.specialty-container button {
  padding: 10px;
  font-size: 12px;
  background-color: #ffdf3e9c;
  cursor: pointer;
  color: black;
  border: none;
  font-weight: 600;
  border-radius: 5px;
}

.specialty-container button:hover {
  background-color: #ffdf3ed2;
}

.selectedSpecialities {
  border: 1px solid #80808054;
  padding: 15px;
  border-radius: 8px;
}

h5 {
  font-size: 14px;
  margin: 10px 0;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  background-color: #f1f1f1;
  margin-bottom: 10px;
  font-size: 14px;
  padding: 7px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
}

li button {
  background-color: #cccac391;
  color: black;
  font-size: 11px;
  font-weight: 600;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
}

li button:hover {
  background-color: #cccac35b;
}

.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .register-form {
    width: 100%;
  }

  .register-container {
    padding: 20px 20px 30px 20px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgb(0 0 0 / 3%);
    border-radius: 10px;
    border: 1px solid #80808030;
    margin: 12px;
  }

  .service-card {
    padding: 15px;
  }

  h2 {
    font-size: 20px;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    font-size: 12px;
  }

  .btn-register {
    font-size: 14px;
  }
}
</style>
