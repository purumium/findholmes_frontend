<template>
  <div class="receive-container">
    <div>
      <h2>답변서 목록</h2>
      <p>탐정이 사용자에게 보낸 답변서 리스트</p>
    </div>

    <div class="receive-list">
      <div
        class="estimate-row"
        v-for="(estimate, index) in estimates"
        :key="'estimate-' + index"
      >
        <!-- Request Card (matching the estimate) -->
        <div class="estimate-card">
          <div class="estimate-image">
            <img src="/images/request.png" alt="Placeholder Image" />
          </div>
          <div class="estimate-content">
            <div
              class="estimate"
              @click="moveToRequestDetail(estimate.requestId)"
            >
              <h4>{{ estimate.requestTitle }}</h4>
              <div class="estimate-date">
                <div>
                  ✔️ 의뢰 일자 :
                  {{ timeconvert(estimate.requestCreateAt) }}
                </div>
                <div>
                  ✔️ 의뢰 분야 :
                  {{ estimate.speciality }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estimate Card -->
        <div class="estimate-card">
          <div class="estimate-image">
            <img src="/images/estimate.png" alt="Placeholder Image" />
          </div>
          <div class="estimate-content">
            <div
              class="estimate"
              @click="moveToEstimateDetail(estimate.requestId)"
            >
              <h4>{{ estimate.estimateTitle }}</h4>
              <div class="estimate-date">
                <div>
                  ✔️ 답변 일자 : {{ timeconvert(estimate.estimateCreateAt) }}
                </div>
                <div>✔️ 답변 분야 : {{ estimate.speciality }}</div>
              </div>
            </div>
          </div>
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
      assignedRequests: [],
      estimates: [],
    };
  },
  computed: {
    ...mapGetters(["getId", "isAuthenticated"]),
  },
  created() {
    this.getEstimateList();
  },
  methods: {
    async getEstimateList() {
      try {
        const response = await axios.get("/api/estimate/list", {
          params: { userId: this.getId },
        });
        this.estimates = response.data;
        console.log("estimate : ", this.estimates);
      } catch (err) {
        return;
      }
    },
    moveToEstimateDetail(requestId) {
      this.$router.push(`/estimate/${requestId}`);
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
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
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

.receive-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.estimate-row {
  display: flex;
  gap: 8px;
  border: 1px solid #80808033;
  border-radius: 10px;
}

.estimate-card {
  flex: 1;
  width: 100%;
  padding: 14px;
  border-radius: 8px;
}

.estimate {
  border: 1px solid #80808052;
  padding: 10px;
  border-radius: 8px;
  box-sizing: border-box;
}

.estimate:hover {
  cursor: pointer;
  background-color: #80808013;
}

.estimate-image {
  text-align: center;
}

.estimate-image img {
  width: 30px;
  height: 30px;
  margin: 10px;
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
  margin-top: 7px;
}

.estimate-date div {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

button {
  background-color: #efe7945e;
  border: 1px solid #d3cb3a5e;
  padding: 6px 17px;
  border-radius: 20px;
  font-size: 12px;

  font-weight: 600;
  cursor: pointer;
}

/* Media Query for small devices */

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
