<template>
  <div class="request-container">
    <header class="request-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>의뢰서 작성</h2>
      <span class="header-span"></span>
    </header>

    <section class="services">
      <div class="service-card">
        <img src="@/assets/main/service1.png" />
        <div>의뢰하고 싶은 내용을 작성하면</div>
        <div><strong>조건에 맞는 홈즈가 </strong>답변서을 보내드립니다</div>
      </div>
    </section>

    <div class="request-contain">
      <form @submit.prevent="doRequest">
        <div class="form-group">
          <label for="title">
            <div>의뢰 제목</div>
            <div>의뢰할 제목을 적어주세요</div>
          </label>
          <input id="title" v-model="title" required />
        </div>

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

        <div class="form-group">
          <label for="description">
            <div>의뢰 내용</div>
            <div>의뢰하고자 하는 내용을 상세히 적어주세요</div>
          </label>
          <textarea id="description" v-model="description" required></textarea>
        </div>

        <div class="form-group">
          <button type="submit" class="submit-button">작성 완료</button>
        </div>
      </form>
    </div>
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
    goBack() {
      this.$router.go(-1);
    },
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
        this.$router.push("/receive");
      } catch (error) {
        alert("의뢰요청에 실패했습니다.");
      }
    },
    click() {
      console.log(this.getUser);
    },
  },
};
</script>

<style scoped>
.request-container {
  font-family: Arial, sans-serif;
}

.request-header {
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

.request-contain {
  margin: 25px 20px;
}

.form-group {
  margin-bottom: 25px;
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
  font-size: 11px;
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
  height: 200px;
  resize: none;
  font-family: auto;
}

.submit-button {
  width: 100%;
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 8px 0px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #ffdf3ee0;
}

/* 태블릿 화면 (768px 이하) */
@media (max-width: 768px) {
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

  p {
    font-size: 10px;
  }

  .request-contain {
    margin: 20px 15px;
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
