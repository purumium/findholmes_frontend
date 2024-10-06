<template>
  <div class="request-container">
    <header class="request-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>선택한 홈즈에게 의뢰서 작성</h2>
      <span class="header-span"></span>
    </header>

    <section class="services">
      <div class="service-card">
        <img src="@/assets/main/service1.png" />
        <div>의뢰서를 작성하여</div>
        <div><strong>내가 선택한 홈즈에게 </strong>바로 전달해보세요</div>
      </div>
    </section>

    <div class="request-contain">
      <div class="detective-info-container">
        <div class="detective-img">
          <img
            class="detective-avatar-large"
            :src="`http://localhost:8080/${detectiveInfo.detectiveImg}`"
            alt="Detective Avatar"
          />
        </div>
        <div class="detective-details-large">
          <div class="detective-name-container">
            <div class="detective-name">
              {{ detectiveInfo.detectiveName }}
            </div>
            <button
              class="detectiva-profile-btn"
              @click="goProfile(detectiveInfo.detectiveId)"
            >
              프로필 보기
            </button>
          </div>
          <div class="detective-contact">
            <span v-if="detectiveInfo.gender === 'MALE' || 'Male'">
              👤 남자 &nbsp;
            </span>
            <span v-else-if="detectiveInfo.gender === 'FEMALE' || 'Female'">
              👤 여자 &nbsp;
            </span>
            <span v-else-if="detectiveInfo.gender === 'ANY' || 'Any'">
              👤 전체 &nbsp;</span
            >
            <span>📍 {{ detectiveInfo.location }} &nbsp; </span>
            <div style="margin-top: 6px">
              ✔️
              <span
                v-for="(name, index) in detectiveInfo.specialities"
                :key="index"
              >
                {{ name.specialityName }} &nbsp;
              </span>
            </div>
          </div>
        </div>
      </div>
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
            <option value="" disabled selected></option>
            <option
              v-for="speciality in detectiveInfo.specialities"
              :key="speciality.specialityId"
              :value="speciality.specialityId"
            >
              {{ speciality.specialityName }}
            </option>
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
import Swal from "sweetalert2";

export default {
  props: ["detectiveId"],
  data() {
    return {
      detectiveInfo: [],
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
    this.getDetectiveInfo();
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

    async getDetectiveInfo() {
      try {
        const response = await axios.get(
          "http://3.35.185.10:8080/detective/info",
          {
            params: { detectiveId: this.detectiveId },
          }
        );
        this.detectiveInfo = response.data;
        this.specialities = response.data.specialities;
        console.log(this.detectiveInfo);
      } catch {
        return;
      }
    },
    async doRequest() {
      try {
        await axios.post("http://3.35.185.10:8080/request", {
          email: this.getUser,
          location: this.detectiveInfo.location,
          gender: this.detectiveInfo.gender,
          speciality: this.selectedSpeciality,
          title: this.title,
          description: this.description,
          detectiveId: this.detectiveId,
        });

        Swal.fire({
          title: "의뢰서 전송 완료",
          text: "홈즈에게 의뢰서를 전송하였습니다",
          icon: "success",
          confirmButtonText: "확인",
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push("/receive");
          }
        });
      } catch (error) {
        Swal.fire({
          title: "의뢰서 전송 실패",
          text: "의뢰서 전송에 실패하였습니다",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    },
    click() {
      console.log(this.getUser);
    },
    goProfile(detectiveId) {
      this.$router.push(`/profile/${detectiveId}`);
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
  font-size: 14px;
}

label div:nth-of-type(1) {
  font-weight: 600;
  color: #433d3d;
}

label div:nth-child(2) {
  color: rgb(107, 101, 101);
  margin-top: 6px;
  font-size: 12px;
}

select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  color: gray;
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
  height: 260px;
  line-height: 27px;
  resize: none;
  font-family: auto;
}

.submit-button {
  width: 100%;
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 10px 0px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #ffdf3ee0;
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

.detective-info-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #80808042;
  background-color: #dad89b21;
  margin-bottom: 24px;
  border-radius: 10px;
  padding: 18px;
}

.detectiva-profile-btn {
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 6px 17px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.detective-avatar-large {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 1px solid #80808059;
  padding: 10px;
  margin-right: 15px;
}

.detective-details-large {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detective-name {
  font-weight: 600;
  font-size: 20px;
}

.detective-name-container {
  display: flex;
  align-items: center;
  gap: 13px;
}

.detective-contact {
  font-size: 13px;
}

.detective-contact p {
  margin: 0;
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
