<template>
  <div>
    <div v-if="selectedDiv === '1'" class="register-container">
      <div  class="register-form" id="1">
        <div class="register-logo"></div>
        <form @submit.prevent="handleSubmit">
          <!-- 탐정 등록-->
          <div class="form-group">
            <label for="business_registration">Business Registration:</label>
            <input
                @change="handleFileChange('businessRegistrationFile', $event)" 
                type="file" 
                id="business_registration" 
                required
            />
          </div>
          <div class="form-group">
            <label for="detective_license">Detective License:</label>
            <input
                @change="handleFileChange('detectiveLicenseFile', $event)" 
                type="file" 
                id="detective_license" 
                required
            />
          </div>
          <div class="form-group">
            <label for="profile_picture">Profile Picture:</label>
            <input
                @change="handleFileChange('profilePictureFile', $event)" 
                type="file" 
                id="profile_picture" 
            />
          </div>
          <div class="form-group">
            <label for="additional_certification">additional certification:</label>
            <input
                @change="handleFileChange('additionalCertification', $event)" 
                type="file" 
                id="additional_certification" 
                
            />
          </div>
          <div class="form-group">
            <textarea 
                v-model="description" 
                id="description" 
                >
            </textarea>
          </div>
          <div class="form-group">
            <textarea 
                v-model="introduction" 
                id="introduction" 
                required>
            </textarea>
          </div>
          <div class="form-group">
            <select v-model="location" id="location" required>
                <option value="" disabled>시/도 선택</option>
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
            <select v-model="detectiveGender" id="detective_gender" required>
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <input
              v-model="resolvedCases"
              type="number"
              id="resolved_cases"
              placeholder="resolved_cases"
              required
            />
          </div>
          <div class="form-group">
            <select v-model="selectedSpecialty" id="specialties">
                <option value="" disabled>Select a specialty</option>
                <option v-for="specialty in specialties" :key="specialty.specialityId" :value="specialty">
                    {{ specialty.specialityName }}
                </option>
            </select>
            <button type="button" @click="addSpecialty">Add</button>
          </div>
          <div v-if="selectedSpecialties.length">
            <h3>Selected Specialties:</h3>
            <ul>
              <li v-for="specialty in selectedSpecialties" :key="specialty.specialityId">
                  {{ specialty.specialityName }}
                  <button type="button" @click="removeSpecialty(specialty.specialityId)">Remove</button>
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

const businessRegistrationFile = ref(null);
const detectiveLicenseFile = ref(null);
const profilePictureFile = ref(null);
const additionalCertification = ref(null);
const introduction = ref('');
const description = ref('');
const location = ref('');
const detectiveGender = ref('');
const resolvedCases = ref(0);
const selectedSpecialties = ref([]);
const selectedSpecialty = ref(null);
const message = ref('');
const specialties = ref([]);
const isSuccess = ref(false);
const selectedDiv = ref("");
const checkReg = ref("");

// 페이지가 마운트된 후, 선택된 div 설정 및 전문 분야 가져오기
onMounted(() => {
  checkDeRegister();
  fetchSpecialties();
});

// 파일이 선택되었을 때 해당 파일 객체를 저장
const handleFileChange = (fileType, event) => {
  const file = event.target.files[0];
  if (fileType === 'businessRegistrationFile') businessRegistrationFile.value = file;
  if (fileType === 'detectiveLicenseFile') detectiveLicenseFile.value = file;
  if (fileType === 'profilePictureFile') profilePictureFile.value = file;
  if (fileType === 'additionalCertification') additionalCertification.value = file;
};

const handleSubmit = async () => {
  const specialtyIds = selectedSpecialties.value.map(s => s.specialityId);
  try {
    // 1. 파일을 FormData에 담아 서버에 전송하고, 저장된 파일 경로를 받음
    const formData = new FormData();
    formData.append('businessRegistration', businessRegistrationFile.value);
    formData.append('detectiveLicense', detectiveLicenseFile.value);
    formData.append('profilePicture', profilePictureFile.value);
    formData.append('additionalCertification', additionalCertification.value);
    
    const fileUploadResponse = await axios.post('/api/detective/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { businessRegistrationPath, detectiveLicensePath, profilePicturePath, additionalCertificationPath } = fileUploadResponse.data;
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // 2. 다른 탐정 정보를 서버에 전송
    const response = await axios.post('/api/detective/register', {
      businessRegistration: businessRegistrationPath,
      detectiveLicense: detectiveLicensePath,
      profilePicture: profilePicturePath,
      additionalCertification: additionalCertificationPath,
      introduction: introduction.value,
      location: location.value,
      detectiveGender: detectiveGender.value,
      resolvedCases: resolvedCases.value,
      specialties: specialtyIds,
      description: description
    });
    console.log(response)

    message.value = '탐정 등록이 완료되었습니다.';
    isSuccess.value = true;

  } catch (error) {
    message.value =
      "Registration failed: " + (error.response?.data || error.message);
    isSuccess.value = false;
  }
};

const checkDeRegister = async () =>{
  try {
    const response = await axios.get('/api/detective/checkregister');
    checkReg.value=1;
    console.log(response.data)
    if(response.data==="PENDING"){
      selectedDiv.value = '2'; 
    }else if(response.data ==="REJECTED"){
      selectedDiv.value = '1'; 
    }else if(response.data ==="APPROVED"){
      selectedDiv.value = '3';
    }else if (response.data ==="NO"){
      selectedDiv.value = '1'; 
    }
  } catch (error) {
    message.value = 'Failed to load specialties.';
  }
}

const fetchSpecialties = async () => {
  try {
    const response = await axios.get('/api/detective/specialties');
    specialties.value = response.data;
  } catch (error) {
    message.value = 'Failed to load specialties.';
  }
};

const addSpecialty = () => {
  if (selectedSpecialty.value && !selectedSpecialties.value.some(s => s.specialityId === selectedSpecialty.value.specialityId)) {
    selectedSpecialties.value.push(selectedSpecialty.value);
    selectedSpecialty.value = null;
  }
};

const removeSpecialty = (specialtyId) => {
  selectedSpecialties.value = selectedSpecialties.value.filter(s => s.specialityId !== specialtyId);
};

</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}

.register-form {
  padding: 40px;
  text-align: center;
  width: 400px;
}

.register-logo {
  margin-bottom: 30px;
}

.register-logo img {
  width: 150px;
  border-radius: 100px;
  border: 1px solid #2f4f4f2e;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  width: 90%;
  padding: 12px 0 12px 20px;
  border: 1px solid #80808045;
  border-radius: 20px;
  background-color: #fff;
  font-size: 15px;
}

/* 역할 선택 섹션 스타일 */
.role-selection {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.role-option {
  cursor: pointer;
}

.role-label {
  display: flex;
  font-size: 13px;
  font-weight: 600;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  border: 2px solid transparent;
  padding: 15px 50px;
  border-radius: 20px;
  transition: border-color 0.3s ease;
}

.role-label.active {
  border-color: #c1ba33; /* 선택된 경우 테두리 색상 변경 */
}

.role-option input[type="radio"] {
  display: none; /* 라디오 버튼 숨기기 */
}

.button-group {
  margin-top: 25px;
}

.btn-register {
  width: 95%;
  padding: 10px;
  border: 1px solid #eae8c1;
  border-radius: 5px;
  background-color: #ede99c;
  color: #46444a;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin: 7px;
}

.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
