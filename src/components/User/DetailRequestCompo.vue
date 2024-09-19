<template>
  <div class="request-form-table">
    <h2>의뢰서</h2>
    <p>홈즈에게 보낸 의뢰서</p>
    <div class="request">
      <table class="request-table">
        <tr>
          <td class="label">의뢰 제목</td>
        </tr>
        <tr>
          <td class="value">{{ request.title }}</td>
        </tr>

        <tr>
          <td class="label">의뢰 종류</td>
        </tr>
        <tr>
          <td class="value">{{ request.speciality }}</td>
        </tr>

        <tr>
          <td class="label">의뢰 지역</td>
        </tr>
        <tr>
          <td class="value">{{ request.location }}</td>
        </tr>

        <tr>
          <td class="label">탐정 성별</td>
        </tr>
        <tr>
          <td class="value">
            {{ request.gender }}
          </td>
        </tr>

        <tr>
          <td class="label">의뢰 내용에 대해 자세한 설명</td>
        </tr>
        <tr>
          <td class="value description">
            <div class="content">
              {{ request.description }}
            </div>
          </td>
        </tr>
      </table>
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
    async getRequestDetail() {
      console.log("실행시도", this.requestId);
      try {
        const response = await axios.get("/api/request/detail", {
          params: { requestId: this.requestId },
        });
        this.request = response.data;
        console.log("response data : ", response.data);
        this.request.gender =
          this.request.gender === "ANY"
            ? "전체"
            : this.request.gender === "MALE"
            ? "남자"
            : "여자";
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
  },
};
</script>

<style scoped>
.request-form-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 30px;
}

h2 {
  text-align: center;
  margin-bottom: -10px;
}

p {
  text-align: center;
  color: #666;
  font-size: 13px;
  margin-bottom: 30px;
}

.request-table {
  width: 100%;
  border-collapse: collapse;
}

.request-table td {
  border: 1px solid #ddd;
  padding: 10px;
}

.label {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: left;
  font-size: 13px;
  padding: 8px 15px !important;
}

.value {
  text-align: left;
  padding: 10px 15px !important;
  font-size: 13px;
  font-family: math !important;
}

.description {
  padding: 10px 15px !important;
}

.content {
  height: 210px;
  margin: 10px 0;
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
    font-family: emoji !important;
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
