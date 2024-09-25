<template>
  <div class="estimate-container">
    <header class="estimate-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>보낸 답변서 보기</h2>
      <span class="header-span"></span>
    </header>

    <section class="services">
      <div class="service-card">
        <img src="@/assets/main/service1.png" />
        <div>홈즈가 작성한 답변서 목록입니다</div>
        <div><strong>의뢰서와 관련된 답변서를 확인</strong>해보세요</div>
      </div>
    </section>

    <div class="estimate-contain">
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
                  ✔️ 의뢰일자 :
                  {{ timeconvert(estimate.requestCreateAt) }}
                </div>
                <div>
                  ✔️ 의뢰분야 :
                  {{ estimate.speciality }}
                </div>
                <div>
                  ✔️ 의뢰지역 :
                  {{ estimate.location }}
                </div>
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
              <h4>{{ estimate.estimateTitle }}</h4>
              <div class="estimate-date">
                <div>
                  ✔️ 답변일자 : {{ timeconvert(estimate.estimateCreateAt) }}
                </div>
                <div>✔️ 답변분야 : {{ estimate.speciality }}</div>
                <div>
                  ✔️ 가능지역 :
                  {{ estimate.location }}
                </div>
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
    goBack() {
      this.$router.go(-1);
    },

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
  font-size: 14px;
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
  border: 1px solid #80808024;
  border-radius: 10px;
  padding: 5px;
}

.estimate-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 6px 0px 3px 5px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.estimate {
  padding: 10px;
  border-radius: 8px;
  box-sizing: border-box;
}

.estimate-card:hover {
  cursor: pointer;
  background-color: #80808013;
}

.estimate-image {
  border: 1px solid #80808030;
  padding: 9px;
  border-radius: 40px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.estimate-image img {
  width: 25px;
  height: 25px;
}

.estimate-content {
  width: 100%;
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

@media (max-width: 768px) {
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

  .estimate-image img {
    width: 20px;
    height: 20px;
  }

  .estimate-image {
    border: 1px solid #80808030;
    padding: 9px;
    border-radius: 40px;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .estimate {
    padding: 10px 5px 3px 5px;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .estimate-content h4 {
    color: #2a2929d6;
    margin: 0;
    font-size: 11px;
  }

  .estimate-date div {
    font-size: 10.5px;
    color: #666;
    margin-bottom: 4px;
  }
  .estimate-contain {
    margin: 16px 10px;
    display: flex;
    flex-direction: column;
    gap: 25px;
  }
}

@media screen and (max-width: 420px) {
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

  .estimate {
    padding: 10px 5px 3px 5px;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .estimate-content h4 {
    color: #2a2929d6;
    margin: 0;
    font-size: 11px;
  }

  .estimate-date div {
    font-size: 10px;
    color: #666;
    margin-bottom: 4px;
  }
  .estimate-contain {
    margin: 16px 10px;
    display: flex;
    flex-direction: column;
    gap: 25px;
  }
}
</style>
