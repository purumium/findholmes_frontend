<template>
  <div class="request-container">
    <header class="request-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>의뢰서</h2>
      <span class="header-span">의뢰서를 확인하고, 답변서를 작성해주세요</span>
    </header>

    <div class="request-contain">
      <div class="request">
        <h3 colspan="2">의뢰서</h3>

        <table class="request-table">
          <tr>
            <td class="label" colspan="1">의뢰 제목</td>
            <td class="value" colspan="3">{{ request.title }}</td>
          </tr>

          <tr>
            <td class="label" colspan="1">의뢰 날짜</td>
            <td class="value" colspan="3">
              {{ timeconvert(request.createAt) }}
            </td>
          </tr>

          <tr>
            <td class="label" colspan="1">의뢰 분야</td>
            <td class="value" colspan="3">{{ request.speciality }}</td>
          </tr>
          <tr>
            <td class="label" colspan="1">의뢰 분야</td>
            <td class="value" colspan="3">{{ request.location }}</td>
          </tr>

          <tr>
            <td class="label" colspan="1">탐정 성별</td>
            <td class="value" colspan="3">
              {{ convertGender(request.detectiveGender) }}
            </td>
          </tr>

          <tr>
            <td class="label" colspan="4">의뢰에 대한 자세한 내용</td>
          </tr>
          <tr>
            <td class="value" colspan="4">
              <div class="description">
                {{ request.description }}
              </div>
            </td>
          </tr>
        </table>
      </div>
      <button @click="createEstimate(requestId)" class="response-btn">
        답변서 작성
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  props: ["requestId"],
  computed: {
    ...mapGetters(["getUser"]),
  },
  data() {
    return {
      request: [],
    };
  },
  created() {
    this.getRequestDetail();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getRequestDetail() {
      console.log("실행시도", this.requestId);
      try {
        const response = await axios.get("/api/request/detail", {
          params: { requestId: this.requestId },
        });
        this.request = response.data;
        console.log(this.request);
      } catch (error) {
        this.assignedRequests = [];
      }
    },
    getUserInfo() {
      console.log(this.getUser);
    },
    moveToReply() {
      this.$router.push(`/detective/reply/${this.request.requestId}`);
    },
    createEstimate(requestId) {
      this.$router.push(`/detective/estimate/${requestId}`);
    },
    convertGender(detectiveGender) {
      if (detectiveGender === "MALE") {
        return "남자";
      } else if (detectiveGender === "FEMALE") {
        return "여자";
      } else {
        return "전체";
      }
    },
    timeconvert(time) {
      const converttime = new Date(time);
      const year = converttime.getFullYear();
      const month = String(converttime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(converttime.getDate()).padStart(2, "0");
      const hour = String(converttime.getHours()).padStart(2, "0");
      const minute = String(converttime.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
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

h3 {
  text-align: center;
  font-size: 19px;
  letter-spacing: 5px;
}

.request-contain {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.request {
  border: 1px solid #8080803b;
  border-radius: 10px;
}

.request-table {
  width: 100%;
  border-collapse: collapse;
}

.request-table td {
  padding: 15px;
  border-top: 1px solid #8080803b;
  width: 130px;
}

.label {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: left;
  font-size: 13px;
}

.value {
  text-align: left;
  font-size: 13px;
  font-family: math !important;
}

.description {
  margin: 0; /* 외부 마진을 없앰 */
  min-height: 210px;
  height: 210px;
  line-height: 20px;
}

.response-btn {
  width: 100%;
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 8px 0;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
}

@media screen and (max-width: 768px) {
  .request-form-table {
    padding: 20px 10px;
  }

  h2 {
    font-size: 18px;
  }

  .p {
    font-size: 12px;
  }

  .label {
    background-color: #f5f5f5;
    font-weight: bold;
    text-align: left;
    padding: 5px 8px !important;
  }

  .value {
    text-align: left;
    padding: 5px 8px !important;
  }

  .request-table td {
    padding: 8px;
    font-size: 12px;
  }

  .description {
    min-height: 150px;
    height: 150px;
    padding: 10px 15px !important;
  }
}
</style>
