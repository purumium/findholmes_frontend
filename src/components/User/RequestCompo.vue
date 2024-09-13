<template>
  <div class="requestform">
    <h2>의뢰서</h2>
    <p>홈즈에게 의뢰하고자 하는 내용을 작성</p>
    <form @submit.prevent="doRequest">
      <!-- 의뢰 제목 입력 -->
      <div class="form-group">
        <label for="title">
          <div>의뢰 제목</div>
          <div>의뢰할 제목을 적어주세요</div>
        </label>
        <input id="title" v-model="title" required />
      </div>

      <!-- 의뢰 종류 선택 -->
      <div class="form-group">
        <label for="specialityCategory">
          <div>의뢰 종류</div>
          <div>의뢰하고 싶은 종류를 선택해주세요</div></label
        >
        <select
          id="specialityCategory"
          @change="console.log(selectedSpeciality)"
          v-model="selectedSpeciality"
          required
        >
          <option value="" disabled selected>category</option>
          <option
            v-for="speciality in specialities"
            :key="speciality.specialityId"
            :value="speciality.specialityId"
          >
            {{ speciality.specialityName }}
          </option>
        </select>
      </div>

      <!-- 지역 선택 -->
      <div class="form-group">
        <label for="locationCategory">
          <div>지역</div>
          <div>홈즈가 활동할 지역을 선택해주세요</div>
        </label>
        <select
          id="locationCategory"
          @change="locationconsole"
          v-model="selectedLocation"
          required
        >
          <option value="" disabled selected>location</option>
          <option
            v-for="location in locations"
            :key="location.locationId"
            :value="location.locationName"
          >
            {{ location.locationName }}
          </option>
        </select>
      </div>

      <!-- 탐정 성별 선택 -->
      <div class="form-group">
        <label for="genderCategory">
          <div>탐정 성별</div>
          <div>의뢰하고 싶은 홈즈의 성별을 선택해주세요</div>
        </label>
        <select
          id="genderCategory"
          @change="console.log(selectedGender)"
          v-model="selectedGender"
          required
        >
          <option value="" disabled selected>gender</option>
          <option value="ANY">전체</option>
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
        </select>
      </div>

      <!-- 의뢰 내용 입력 -->
      <div class="form-group">
        <label for="description">
          <div>의뢰 내용</div>
          <div>의뢰하고자 하는 내용을 상세히 적어주세요</div>
        </label>
        <textarea id="description" v-model="description" required></textarea>
      </div>

      <!-- 작성 완료 버튼 -->
      <div class="form-group">
        <button type="submit" class="submit-button">작성 완료</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import locations from "@/assets/locations.json";

export default {
  data() {
    return {
      locations: locations,
      specialities: [],
      selectedLocation: "",
      selectedGender: "",
      selectedSpeciality: "",
      title: "",
      description: "",
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getUser"]),
  },
  created() {
    this.getAllSpecialties();
  },
  methods: {
    printToken() {
      console.log(this.$store.state.token);
    },
    printUser() {
      console.log(this.$store.getters.getUser);
    },
    async getAllSpecialties() {
      try {
        const response = await axios.get("api/speciality");
        this.specialities = response.data;
      } catch (error) {
        this.specialities = [];
      }
    },
    async doRequest() {
      try {
        await axios.post("api/request", {
          email: this.getUser,
          location: this.selectedLocation,
          gender: this.selectedGender,
          speciality: this.selectedSpeciality,
          title: this.title,
          description: this.description,
        });
        alert("의뢰요청에 성공했습니다.");
      } catch (error) {
        alert("의뢰요청에 실패했습니다.");
      }
    },
  },
};
</script>

<style scoped>
.requestform {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
}

h2 {
  text-align: center;
  margin-bottom: -10px;
}

p {
  text-align: center;
  color: #666;
  font-size: 12px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 0px;
  background-color: #80808012;
  border: none;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 7px 12px;
  font-size: 13px;
}

label div:nth-of-type(1) {
  font-weight: 600;
  color: #433d3d;
}

label div:nth-child(2) {
  color: rgb(107, 101, 101);
  margin-top: 5px;
  font-size: 10px;
}

select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-right: 1px solid #8080804d;
  border-bottom: 1px solid #8080804d;
  border-left: 1px solid #8080804d;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-right: 1px solid #8080804d;
  border-bottom: 1px solid #8080804d;
  border-left: 1px solid #8080804d;
  box-sizing: border-box;
}

textarea {
  height: 100px;
  resize: none;
}

.submit-button {
  width: 100%;
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 8px 0px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #ffdf3ee0;
}

/* 반응형 스타일 */

/* 태블릿 화면 (768px 이하) */
@media (max-width: 768px) {
  .requestform {
    padding: 20px;
  }

  h2 {
    font-size: 18px;
  }

  p {
    font-size: 11px;
  }

  .form-group label {
    font-size: 12px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 13px;
    padding: 8px;
  }

  .submit-button {
    font-size: 13px;
    padding: 7px;
  }
}

/* 모바일 화면 (480px 이하) */
@media (max-width: 480px) {
  .requestform {
    padding: 15px;
  }

  h2 {
    font-size: 16px;
  }

  p {
    font-size: 10px;
  }

  .form-group label {
    font-size: 11px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 12px;
    padding: 7px;
  }

  .submit-button {
    font-size: 12px;
    padding: 6px;
  }
}
</style>
