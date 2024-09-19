<template>
  <div class="receive-container">
    <h2>의뢰서 목록</h2>
    <p>사용자가 보낸 의뢰서에 답변서 보내기</p>

    <!-- Filter Select -->
    <div class="filter-container">
      <span class="hello-world"
        ><h3>
          {{
            filterStatus === "all"
              ? "전체"
              : filterStatus === "WAITING"
              ? "답변 대기중"
              : "답변 완료"
          }}
        </h3></span
      >
      <select v-model="filterStatus" id="status-filter">
        <option value="all">전체</option>
        <option value="WAITING">답변 대기중</option>
        <option value="ANSWERED">답변 완료</option>
      </select>
    </div>

    <div class="receive-list">
      <div
        v-for="(assigned, index) in filteredRequests"
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
              <div>✔️ 의뢰 일자 : {{ assigned.createAt }}</div>
              <div>✔️ 의뢰 분야 : {{ assigned.speciality.specialityName }}</div>
              <div>✔️ 의뢰 장소 : {{ assigned.location }}</div>
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
      filterStatus: "all",
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getId"]),

    filteredRequests() {
      if (this.filterStatus === "WAITING") {
        return this.assignedRequests.filter(
          (request) => request.status === "WAITING"
        );
      } else if (this.filterStatus === "ANSWERED") {
        return this.assignedRequests.filter(
          (request) => request.status === "ANSWERED"
        );
      } else {
        return this.assignedRequests; // Show all requests when 'all' is selected
      }
    },
  },
  created() {
    this.getAssignedRequests();
  },
  methods: {
    async getAssignedRequests() {
      console.log("실행시도");
      try {
        const response = await axios.get("/api/request/receive", {
          params: { userId: this.getId },
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

.filter-container {
  margin-bottom: 20px;
  margin-right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hello-world {
  font-size: 14px;
  color: #333;
  margin-left: 20px;
}

#status-filter {
  padding: 8px 11px;
  font-size: 12px;
  border-radius: 20px;
  border: 1px solid #ccc;
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
  margin-top: 7px;
}

.estimate-date div {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

button {
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 7px 12px;
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
