<template>
  <div class="find-container">
    <header class="find-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>프로필 편집</h2>
    </header>
    <div class="register-container">
      <div class="register-form" id="1">
        <div class="register-logo">
          <form @submit.prevent="handleProfileSubmit">
            <div
              v-if="imagePaths.businessRegistrationPath"
              @click="showModal('businessRegistrationPath')"
            >
              <h1>Business Registration</h1>
              <img
                :src="getImageUrl(imagePaths.businessRegistrationPath)"
                alt="Business Registration"
                class="thumbnail"
              />
            </div>
            <div
              v-if="imagePaths.detectiveLicensePath"
              @click="showModal('detectiveLicensePath')"
            >
              <h1>Detective License</h1>
              <img
                :src="getImageUrl(imagePaths.detectiveLicensePath)"
                alt="Detective License"
                class="thumbnail"
              />
            </div>
            <div
              v-if="imagePaths.profilePicturePath"
              @click="showModal('profilePicturePath')"
            >
              <h1>Profile Picture</h1>
              <img
                :src="getImageUrl(imagePaths.profilePicturePath)"
                alt="Profile Picture"
                class="thumbnail"
                style="width: 50px;"
              />
            </div>
            <button
              v-if="imagePaths.profilePicturePath"
              @click="deleteProfilePicture()"
            >
              프로필 사진 삭제
            </button>

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

            <div
              v-if="imagePaths.additionalCertificationPath"
              @click="showModal('additionalCertification')"
            >
              <h1>추가 정보</h1>
              <img
                :src="getImageUrl(imagePaths.additionalCertificationPath)"
                alt="additional certification"
                class="thumbnail"
              />
            </div>
            <button
              v-if="imagePaths.additionalCertificationPath"
              @click="deleteAdditionalCertification()"
            >
              추가 정보 삭제
            </button>
            <div v-if="!imagePaths.additionalCertificationPath">
              <h3>추가정보 추가</h3>
              <div class="form-group">
                <label for="additional_certification"
                  >Additional Certification:</label
                >
                <input
                  @change="handleFileChange('additionalCertification', $event)"
                  type="file"
                  id="additional_certification"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="description">추가 설명</label>
              <textarea v-model="description" id="description"> </textarea>
            </div>

            <div class="form-group">
              <label for="location">활동지역</label>
              <select v-model="location" id="location" required>
                <option value="" disabled>활동지역을 선택해주세요</option>
                <option value="서울특별시">서울특별시</option>
                <option value="인천광역시">인천광역시</option>
                <option value="강원도">강원도</option>
                <option value="충청북도">충청북도</option>
                <option value="충청남도(대전,세종)">
                  충청남도(대전, 세종)
                </option>
                <option value="전라북도">전라북도</option>
                <option value="전라남도(광주)">전라남도(광주)</option>
                <option value="경상북도(대구)">경상북도(대구)</option>
                <option value="경상남도(부산,울산)">
                  경상남도(부산, 울산)
                </option>
                <option value="제주특별자치도">제주특별자치도</option>
              </select>
            </div>

            <div class="form-group">
              <label>이메일</label>
              <input
                v-model="email"
                type="email"
                id="email"
                required
                readonly
              />
            </div>
            <div class="form-group">
              <label>이름</label>
              <input v-model="userName" type="text" id="username" required />
            </div>
            <div class="form-group">
              <label>휴대폰</label>
              <input
                v-model="phoneNumber"
                type="text"
                id="phonenumber"
                required
              />
            </div>
            <div class="form-group">
              <label for="introduction">자기소개</label>
              <textarea v-model="introduction" id="introduction" required>
              </textarea>
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
              <button
                type="submit"
                class="btn-register"
              >
                프로필 수정
              </button>
            </div>
          </form>
          <form @submit.prevent="changePW">
            <div>
              <div class="form-group">
                <label>현재 비밀번호</label>
                <input
                  v-model="currentPassword"
                  type="password"
                  id="currentPassword"
                  required
                />
              </div>
              <div class="form-group">
                <label>새 비밀번호</label>
                <input
                  v-model="newPassword"
                  type="password"
                  id="newPassword"
                  required
                />
              </div>
              <div class="form-group">
                <label>비밀번호 확인</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  required
                />
              </div>
              <p
                v-if="passwordMessage"
                :class="{ error: !isPasswordValid, success: isPasswordValid }"
              >
                {{ passwordMessage }}
              </p>
            </div>
            <div class="button-group">
              <button
                class="btn-register"
                :disabled="!isPasswordValid"
              >
                비밀번호 변경
              </button>
            </div>
          </form>
        </div>
      </div>

      <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">
        {{ message }}
      </p>
    </div>
    <div v-if="isModalVisible" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <img
          :src="getImageUrl(imagePaths[selectedImagePath])"
          alt="Full Size Image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

// 상태 변수
const profilePictureFile = ref(null);
const additionalCertification = ref(null);
const createdAt = ref("");
const currentPoints = ref("");
const gender = ref("");
const email = ref("");
const introduction = ref("");
const description = ref("");
const location = ref("");
const phoneNumber = ref("");
const resolvedCases = ref("");
const userName = ref("");
const imagePaths = ref({
  businessRegistrationPath: null,
  detectiveLicensePath: null,
  profilePicturePath: null,
  additionalCertificationPath: null,
});
const deleteProfile = ref("");
const deleteadditionalCertification = ref("");
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isPasswordValid = ref(false);
const isSuccess = ref(false);
const passwordMessage = ref("");
const message = ref("");
const router = useRouter();
const isProfileDelete = ref(false);
const isadditionalCertificationDelete = ref(false);
const specialtiesName = ref([]);

const selectedSpecialties = ref([]);
const selectedSpecialty = ref(null);
const specialties = ref([]);

// 모달 관련 상태
const isModalVisible = ref(false);
const selectedImagePath = ref("");

const fetchSpecialties = async () => {
  try {
    const response = await axios.get("/api/detective/specialties");
    specialties.value = response.data;

    for (let j = 0; j < specialtiesName.value.length; j++) {
      for (let i = 0; i < specialties.value.length; i++) {
        if (specialtiesName.value[j] === specialties.value[i].specialityName) {
          console.log("aaaaa");
          selectedSpecialties.value.push(specialties.value[i]);
        }
      }
    }
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

const handleFileChange = (fileType, event) => {
  const file = event.target.files[0];
  if (fileType === "profilePictureFile") profilePictureFile.value = file;
  if (fileType === "additionalCertification")
    additionalCertification.value = file;
};

onMounted(async () => {
  await getUser(); // 데이터 가져오기를 완료한 후
  await fetchSpecialties(); // 그 다음에 specialties 가져오기
});

const deleteProfilePicture = () => {
  isProfileDelete.value = true;
  deleteProfile.value = imagePaths.value.profilePicturePath;
  imagePaths.value.profilePicturePath = "";
  profilePictureFile.value = null;
};

const deleteAdditionalCertification = () => {
  isadditionalCertificationDelete.value = true;
  deleteadditionalCertification.value =
    imagePaths.value.additionalCertificationPath;
  imagePaths.value.additionalCertificationPath = "";
  additionalCertification.value = null;
};

// 데이터 가져오기 함수
const getUser = async () => {
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  try {
    const response = await axios.get("/api/detective/getDetectiveDetail");
    const data = response.data;
    console.log(response.data);
    createdAt.value = data.createdAt;
    currentPoints.value = data.currentPoints;
    gender.value = data.detectiveGender;
    email.value = data.email;
    introduction.value = data.introduction;
    location.value = data.location;
    description.value = data.description;
    phoneNumber.value = data.phoneNumber;
    additionalCertification.value = data.additionalCertifications;
    resolvedCases.value = data.resolvedCases;
    userName.value = data.userName;
    specialtiesName.value = data.specialtiesName;
    console.log(specialtiesName.value);
    imagePaths.value.businessRegistrationPath = data.businessRegistration;
    imagePaths.value.detectiveLicensePath = data.detectiveLicense;
    imagePaths.value.profilePicturePath = data.profilePicture;
    imagePaths.value.additionalCertificationPath =
      data.additionalCertifications;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const checkPasswordMatch = () => {
  if (newPassword.value === confirmPassword.value) {
    isPasswordValid.value = true;
    passwordMessage.value = "비밀번호가 일치합니다.";
  } else {
    isPasswordValid.value = false;
    passwordMessage.value = "비밀번호가 일치하지 않습니다.";
  }
};
watch(newPassword, checkPasswordMatch);
watch(confirmPassword, checkPasswordMatch);

const goBack = () => {
  router.push("/detective/mypage");
};

const changePW = async() =>{
  console.log("비번변결")
  if (!isPasswordValid.value) {
    message.value = "비밀번호가 일치하지 않습니다.";
    isSuccess.value = false;
    return;
  }
  try {
    const response = await axios.get("/api/detective/pwCheck", {
      params: { password: currentPassword.value },
    });
    console.log(response)
    if(response.data){
      await updatePW({
        password: confirmPassword.value,
      });
      alert("비밀번호 수정이 완료되었습니다.");
      router.push("/detective/mypage");
    }else{
      alert("현재 비밀번호가 틀립니다");
    }
  } catch (error) {
    console.error(error);
    alert("오류가 발생했습니다. 다시 시도해 주세요.");
  }
}

const handleProfileSubmit = async () => {
  console.log("프로필수정")

  if (selectedSpecialties.value.length === 0) {
    console.log(selectedSpecialties)
    message.value = "전문 분야를 선택해 주세요";
    isSuccess.value = false;
    return;
  }

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (isProfileDelete.value) {
      // 파일 삭제
      await deleteFile(deleteProfile.value);
    }
    if (isadditionalCertificationDelete.value) {
      // 파일 삭제
      await deleteFile(deleteadditionalCertification.value);
    }
    // 파일 업로드 및 프로필 수정
    const { profilePicturePath, additionalCertificationPath } =
      await uploadFiles();
    const specialtyIds = selectedSpecialties.value.map((s) => s.specialityId);
    await updateProfile({
      profilePicture: profilePicturePath,
      additionalCertifications: additionalCertificationPath,
      description: description.value,
      introduction: introduction.value,
      userName: userName.value,
      phoneNumber: phoneNumber.value,
      password: confirmPassword.value,
      location: location.value,
      specialties: specialtyIds,
    });
    message.value = "탐정 등록이 완료되었습니다.";
    alert("탐정 정보 수정이 완료되었습니다.");
    router.push("/detective/mypage");

};

const deleteFile = async (filePath) => {
  const formData = new URLSearchParams();
  formData.append("filePath", filePath);
  formData.append("state", "delete");

  try {
    const response = await axios.post("/api/detective/updateFile", formData);
    console.log("File deletion successful:", response.data);
  } catch (error) {
    console.error(
      "Error deleting file:",
      error.response ? error.response.data : error.message
    );
    alert("파일 삭제 중 오류가 발생했습니다.");
  }
};

const uploadFiles = async () => {
  const formData = new FormData();
  formData.append("profilePicture", profilePictureFile.value);
  formData.append("additionalCertification", additionalCertification.value);

  try {
    const fileUploadResponse = await axios.post(
      "/api/detective/files",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return {
      profilePicturePath: fileUploadResponse.data.profilePicturePath,
      additionalCertificationPath:
        fileUploadResponse.data.additionalCertificationPath,
    };
  } catch (error) {
    console.error(
      "Error uploading files:",
      error.response ? error.response.data : error.message
    );
    alert("파일 업로드 중 오류가 발생했습니다.");
    throw error; // 에러를 다시 던져서 상위 함수에서 처리
  }
};

const updateProfile = async (data) => {
  try {
    await axios.post("/api/detective/update", data);
  } catch (error) {
    console.error(
      "Error updating profile:",
      error.response ? error.response.data : error.message
    );
    alert("프로필 업데이트 중 오류가 발생했습니다.");
    throw error; // 에러를 다시 던져서 상위 함수에서 처리
  }
};
const updatePW = async (data) => {
  try {
    await axios.post("/api/detective/updatepw", data);
  } catch (error) {
    console.error(
      "Error updating profile:",
      error.response ? error.response.data : error.message
    );
    alert("프로필 업데이트 중 오류가 발생했습니다.");
    throw error; // 에러를 다시 던져서 상위 함수에서 처리
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
  left: 0;
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

  .form-group input,
  .form-group textarea,
  .form-group select {
    font-size: 12px;
  }

  .btn-register {
    font-size: 14px;
  }
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
