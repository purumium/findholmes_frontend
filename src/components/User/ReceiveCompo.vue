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
        <div>내가 작성한 의뢰서와</div>
        <div>홈즈에게 받은 답변서를 확인해보세요</div>
      </div>
    </section>

    <div class="receive-contain">
      <div
        v-for="(request, index) in requests"
        :key="index"
        class="request-card"
      >
        <div class="request-image">
          <img src="/images/estimate.png" alt="Placeholder Image" />
        </div>
        <div class="request-content">
          <div class="request" @click="moveToRequestDetail(request.requestId)">
            <h4>{{ request.title }}</h4>
            <div class="request-date">
              <div>#{{ request.createAt }}</div>
              <div>#{{ request.speciality }}</div>
            </div>
          </div>

          <button
            @click="viewEstimate(request.requestId)"
            v-if="request.status !== false"
          >
            홈즈의 답변서
          </button>
          <button @click="viewEstimate(request.requestId)" v-else disabled>
            댭변 대기중
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
      this.$router.push(`/estimate/${requestId}`);
    },
    moveToRequestDetail(requestId) {
      this.$router.push(`/detailrequest/${requestId}`);
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
  /* margin-bottom: 10px; */
  height: 110px;
  width: 130px;
}

.service-card div {
  font-size: 13px;
  color: #190404;
  margin: 5px 0;
}

.request {
  border: 1px solid #80808052;
  padding: 12px 0px 12px 15px;
  max-width: 400px;
  width: 400px;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 11px;
  transition: background-color 0.4s ease;
}

.request:hover {
  cursor: pointer;
  background-color: #80808013;
}

.request-card {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #80808021;
}

.request-image img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin: 20px 30px;
}

.request-content {
  flex: 1;
}

.request-content h4 {
  color: #2a2929d6;
  margin: 0;
  font-size: 14px;
}

.request-date {
  display: flex;
  gap: 14px;
  align-items: end;
  margin-top: 4px;
}

.request-date div {
  font-size: 12px;
  color: #666;
}

button {
  background-color: #efe7945e;
  border: 1px solid #d3cb3a5e;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
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
    flex-direction: column; /* 화면이 작아지면 세로로 배치 */
    text-align: center;
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
