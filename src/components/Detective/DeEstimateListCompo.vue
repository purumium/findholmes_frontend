<template>
  <div class="estimate-container">
    <header class="estimate-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>보낸 답변서</h2>
      <span class="header-span"></span>
    </header>

    <section class="services">
      <div class="service-card">
        <img src="@/assets/main/service1.png" />
        <div>홈즈가 작성한 답변서 목록입니다.</div>
        <div>의뢰서와 답변서를 함께 확인해보세요.</div>
      </div>
    </section>

    <div class="estimate-contain">
      <div
        class="estimate-row"
        v-for="(estimate, index) in estimates"
        :key="'estimate-' + index"
      >
        <div v-if="assignedRequests[index]" class="estimate-card">
          <div class="estimate-image">
            <img src="/images/request.png" alt="Placeholder Image" />
          </div>
          <div class="estimate-content">
            <div
              class="estimate"
              @click="moveToRequestDetail(assignedRequests[index].requestId)"
            >
              <h4>{{ assignedRequests[index].title }}</h4>
              <div class="estimate-date">
                <div>
                  ✔️ 의뢰 일자 :
                  {{ timeconvert(assignedRequests[index].createAt) }}
                </div>
                <div>
                  ✔️ 의뢰 분야 :
                  {{ assignedRequests[index].speciality.specialityName }}
                </div>
                <div>{{ estimate.requestId }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="estimate-card">
          <div class="estimate-image">
            <img src="/images/estimate.png" alt="Placeholder Image" />
          </div>
          <div class="estimate-content">
            <div
              class="estimate"
              @click="moveToEstimateDetail(estimate.requestId)"
            >
              <h4>{{ estimate.title }}</h4>
              <div class="estimate-date">
                <div>✔️ 답변 일자 : {{ timeconvert(estimate.createAt) }}</div>
                <div>✔️ 답변 분야 : {{ estimate.speciality }}</div>
                <div>{{ estimate.requestId }}</div>
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
    ...mapGetters(["getUser", "isAuthenticated"]),
  },
  created() {
    this.getEstimateList();
    this.getAssignedRequests();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getAssignedRequests() {
      try {
        const response = await axios.get("/api/receive", {
          params: { email: this.getUser },
        });
        this.assignedRequests = response.data;
        console.log("assigned : ", this.assignedRequests);
      } catch (error) {
        this.assignedRequests = [];
      }
    },
    async getEstimateList() {
      try {
        const response = await axios.get("/api/reply/estimate", {
          params: { email: this.getUser },
        });
        this.estimates = response.data;
        console.log("estimate : ", this.estimates);
      } catch (err) {
        return;
      }
    },
    moveToEstimateDetail(requestId) {
      this.$router.push(`/detective/view/estimate/${requestId}`);
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
.estimate-container {
  max-width: 800px;
  font-family: Arial, sans-serif;
}

.estimate-header {
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
  font-size: 13px;
  color: #190404;
  margin: 5px 0;
}

.estimate-contain {
  margin: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
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
