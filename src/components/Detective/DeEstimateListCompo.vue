<template>
  <div class="receive-container">
    <h2>보낸 견적서</h2>
    <p>의뢰 요청에 대해 홈즈가 보내준 견적서</p>
    <div class="receive-list">
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
          <button @click="viewEstimate(estimate.requestId)">견적서 보기</button>
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
    async getEstimateList() {
      try {
        const response = await axios.get("/api/reply/estimate", {
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
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 0;
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
  background-color: #bbb4b41a;
  padding: 20px;
  margin-bottom: 20px;
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
  background-color: #fdf7b8bf;
  border: 1px solid #e8e37e;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
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
