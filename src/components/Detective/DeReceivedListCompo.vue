<template>
  <div class="receive-container">
    <h2>받은 상담요청서 리스트</h2>
    <p>사용자가 작성한 상담 요청서가 도착했습니다</p>
    <div class="receive-list">
      <div
        v-for="(assigned, index) in assignedRequests"
        :key="index"
        class="estimate-card"
      >
        <div class="estimate-image">
          <img src="/images/request.png" alt="Placeholder Image" />
        </div>
        <div class="estimate-content">
          <div
            class="estimate"
            @click="moveToRequestDetail(assigned.requestId)"
          >
            <h4>{{ assigned.title }}</h4>
            <div class="estimate-date">
              <div># 받은 일자 : {{ assigned.createAt }}</div>
              <div># 분야 : {{ assigned.speciality.specialityName }}</div>
            </div>
          </div>
          <button @click="createEstimate(assigned.requestId)">
            견적서 작성
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
      assignedRequests: [],
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getUser"]),
  },
  created() {
    this.getAssignedRequests();
  },
  methods: {
    async getAssignedRequests() {
      console.log("실행시도");
      try {
        const response = await axios.get("/receive", {
          baseURL: "http://localhost:8080/",
          params: { email: this.getUser },
        });
        this.assignedRequests = response.data;
        console.log(this.assignedRequests);
      } catch (error) {
        this.assignedRequests = [];
      }
    },
    moveToRequestDetail(requestId) {
      this.$router.push(`/detective/received/${requestId}`);
    },
    createEstimate(requestId) {
      this.$router.push(`/detective/reply/${requestId}`);
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
  background-color: #efe7945e;
  border: 1px solid #d3cb3a5e;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 10px;
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
