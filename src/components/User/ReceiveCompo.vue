<template>
  <div class="receive-container">
    <header class="receive-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>의뢰서와 답변서</h2>
      <span class="receive-span"></span>
    </header>

    <section class="services">
      <div class="service-card">
        <img src="@/assets/main/service1.png" />
        <div>
          <strong>내가 작성한 의뢰서</strong>와
          <strong>홈즈에게 받은 답변서</strong>를 확인하고
        </div>
        <div>마음에 드는 홈즈와 이야기를 나누어보세요</div>
      </div>
    </section>

    <div class="request-list">
      <div
        v-for="(request, index) in requests"
        :key="index"
        class="request-card"
      >
        <div class="card-left" @click="moveToRequestDetail(request.requestId)">
          <div class="request-form">
            <img class="request-icon" src="/images/estimate.png" alt="의뢰서" />
            <span class="name-tag">의뢰서</span>
          </div>
          <div class="request-details">
            <div class="request-title">
              <span>{{ request.title }}</span>
            </div>
            <p>✔️ 의뢰일자 : {{ timeconvert(request.createAt) }}</p>
            <p>✔️ 의뢰분야 : {{ request.speciality }}</p>
          </div>
        </div>
        <div class="card-right">
          <img class="response-icon" src="/images/request.png" alt="답변서" />
          <button
            @click="viewEstimate(request.requestId)"
            :disabled="request.status === false"
            class="response-button"
          >
            {{ request.status === false ? "답변 대기중" : "홈즈의 답변서" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      requests: [],
    };
  },
  computed: {
    ...mapGetters(["getId"]),
  },
  created() {
    this.getRequestList();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getRequestList() {
      try {
        const response = await axios.get("api/request/list", {
          params: { userId: this.getId },
        });
        this.requests = response.data;
        this.requests.sort(function (a, b) {
          return -(new Date(a.createAt) - new Date(b.createAt));
        });
        console.log(this.requests);
      } catch (err) {
        return;
      }
    },
    viewEstimate(requestId) {
      this.$router.push(`/estimatelist/${requestId}`);
    },
    moveToRequestDetail(requestId) {
      this.$router.push(`/detailrequest/${requestId}`);
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
.receive-container {
  max-width: 800px;
  font-family: Arial, sans-serif;
}

.receive-header {
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

.receive-span {
  color: #666;
  font-size: 12px;
  margin: 5px 0 0 5px;
}

.receive-contain {
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
  height: 110px;
  width: 130px;
}

.service-card div {
  font-size: 14px;
  color: #190404;
  margin: 5px 0;
}

.name-tag {
  border: 1px solid #8080804d;
  padding: 2px 6px;
  font-size: 9px;
  background-color: #f3cb0024;
  border-radius: 20px;
}

.request-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}

.request-details p {
  margin: 4px 0;
}

.request-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 25px 15px;
}

.request-card {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #dddddda4;
  border-radius: 10px;
  padding: 20px;
  align-items: center;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 20px;
  min-width: 340px;
  background-color: #8080800f;
  cursor: pointer;
}

.card-left:hover {
  background-color: rgba(128, 128, 128, 0.123);
}

.request-icon {
  width: 40px;
  height: 40px;
  text-align: center;
}

.request-details {
  font-size: 13px;
}

.request-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 7px;
}

.card-right {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 17px;
}

.response-icon {
  width: 40px;
  height: 40px;
}

.response-button {
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.response-button:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
  color: #aaa;
}

@media (max-width: 768px) {
  .request {
    border: 1px solid #80808052;
    padding: 10px 25px;
    max-width: 400px;
    border-radius: 20px;
    box-sizing: border-box;
    text-align: center;
  }

  .request-date {
    display: flex;
    gap: 14px;
    align-items: end;
    justify-content: center;
    margin-top: 4px;
  }

  .request-card {
    flex-direction: column;
    /* text-align: center; */
    gap: 30px;
  }

  .request-image img {
    margin: 10px auto; /* 이미지를 가운데 정렬 */
  }

  .request-content {
    margin-top: 10px;
  }

  .request-content h4 {
    font-size: 14px;
  }

  .request-content div {
    font-size: 12px;
  }

  button {
    font-size: 10px;
    padding: 5px 8px;
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
