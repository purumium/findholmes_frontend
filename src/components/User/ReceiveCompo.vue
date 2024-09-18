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
        v-for="(estimate, index) in estimates"
        :key="index"
        class="estimate-card"
      >
        <div class="estimate-image">
          <img src="/images/estimate.png" alt="Placeholder Image" />
        </div>
        <div class="estimate-content">
          <div
            class="estimate"
            @click="moveToRequestDetail(estimate.requestId)"
          >
            <h4>{{ estimate.title }}</h4>
            <div class="estimate-date">
              <div>#{{ estimate.createAt }}</div>
              <div>#{{ estimate.speciality }}</div>
            </div>
          </div>

          <button @click="viewEstimate(estimate.requestId)">
            홈즈의 답변서
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
      estimates: [],
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  created() {
    this.getEstimateList();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getEstimateList() {
      try {
        const response = await axios.get("api/receive/estimate", {
          params: { email: this.getUser },
        });
        this.estimates = response.data;
        console.log(this.estimates);
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

.estimate {
  border: 1px solid #80808052;
  padding: 12px 0px 12px 15px;
  max-width: 400px;
  width: 400px;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 11px;
  transition: background-color 0.4s ease;
}

.estimate:hover {
  cursor: pointer;
  background-color: #80808013;
}

.estimate-card {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #80808021;
}

.estimate-image img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin: 20px 30px;
}

.estimate-content {
  flex: 1;
}

.estimate-content h4 {
  color: #2a2929d6;
  margin: 0;
  font-size: 14px;
}

.estimate-date {
  display: flex;
  gap: 14px;
  align-items: end;
  margin-top: 4px;
}

.estimate-date div {
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

@media (max-width: 768px) {
  h2 {
    font-size: 20px;
  }

  .estimate {
    border: 1px solid #80808052;
    padding: 10px 25px;
    max-width: 400px;
    border-radius: 20px;
    box-sizing: border-box;
    text-align: center;
  }

  .estimate-date {
    display: flex;
    gap: 14px;
    align-items: end;
    justify-content: center;
    margin-top: 4px;
  }

  .estimate-card {
    flex-direction: column; /* 화면이 작아지면 세로로 배치 */
    text-align: center;
  }

  .estimate-image img {
    margin: 10px auto; /* 이미지를 가운데 정렬 */
  }

  .estimate-content {
    margin-top: 10px;
  }

  .estimate-content h4 {
    font-size: 14px;
  }

  .estimate-content div {
    font-size: 12px;
  }

  button {
    font-size: 10px;
    padding: 5px 8px;
  }
}
</style>
