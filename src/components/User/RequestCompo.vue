<template>
  <div class="requestform">
    의뢰요청 페이지
    <form @submit.prevent="doRequest">
      <div>
        지역
        <div>
          <select
            id="locationCategory"
            @change="locationconsole"
            v-model="selectedLocation"
            required
          >
            <option value="" disabled selected>주소를 선택해주세요.</option>
            <option
              v-for="location in locations"
              :key="location.locationId"
              :value="location.locationName"
            >
              {{ location.locationName }}
            </option>
          </select>
        </div>
      </div>

      <div>탐정의 성별</div>
      <select
        id="genderCategory"
        @change="console.log(selectedGender)"
        v-model="selectedGender"
        required
      >
        <option value="" disabled selected>성별을 선택해주세요.</option>
        <option value="ANY">전체</option>
        <option value="MALE">남자</option>
        <option value="FEMALE">여자</option>
      </select>

      <div>의뢰 종류</div>
      <select
        id="specialityCategory"
        @change="console.log(selectedSpeciality)"
        v-model="selectedSpeciality"
        required
      >
        <option value="" disabled selected>의뢰종류를 선택해주세요.</option>
        <option
          v-for="speciality in specialities"
          :key="speciality.specialityId"
          :value="speciality.specialityId"
        >
          {{ speciality.specialityName }}
        </option>
      </select>

      <div>
        의뢰 제목
        <div>
          <input v-model="title" v-on="console.log(description)" required />
        </div>
      </div>

      <div>
        의뢰 내용
        <div>
          <textarea
            v-model="description"
            v-on="console.log(description)"
          ></textarea>
        </div>
      </div>
      <div>
        <button type="submit">작성 완료</button>
      </div>
    </form>
  </div>
  <div>
    <h1>없나요? :{{ getUser }}</h1>
    <h1>됐나요? : {{ isAuthenticated }}</h1>
    <button @click="printToken">토큰</button>
    <button @click="printUser">유저</button>
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
.requestform form {
  width: 420px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #cac8c8;
  padding: 10px 30px 30px;
  border-radius: 20px;
}
</style>
