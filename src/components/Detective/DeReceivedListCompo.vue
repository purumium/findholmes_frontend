<template>
  <div class="receive-container">
    <header class="receive-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>받은 의뢰서</h2>
      <span class="receive-span"></span>
    </header>

    <section class="services">
      <div class="service-card">
        <img src="@/assets/main/service1.png" />
        <div>사용자가 보낸 의뢰서를 확인하고</div>
        <div>답변서를 보내보세요</div>
      </div>
    </section>

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

    <div class="receive-contain">
      <div
        v-for="(assigned, index) in filteredRequests"
        :key="index"
        class="estimate-card"
        @click="moveToRequestDetail(assigned.requestId)"
      >
        <div class="estimate-image">
          <img
            :src="
              assigned.status === 'WAITING'
                ? '/images/waiting.png'
                : '/images/request.png'
            "
            alt="Placeholder Image"
          />
        </div>
        <div class="estimate-content">
          <div class="estimate">
            <h4>{{ assigned.title }}</h4>
            <div class="estimate-date">
              <div>✔️ 의뢰 일자 : {{ timeconvert(assigned.createAt) }}</div>
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
    goBack() {
      this.$router.go(-1);
    },
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

.filter-container {
  margin: 10px 10px 0 -7px;
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

.receive-contain {
  margin: 0 auto;
  padding: 10px 10px 25px 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.estimate-card {
  align-items: center;
  border: 1px solid #80808038;
  padding: 10px;
  border-radius: 8px;
}

.estimate {
  padding: 2px 10px;
  max-width: 245px;
  box-sizing: border-box;
}

.estimate-card:hover {
  cursor: pointer;
  background-color: #80808013;
}

.estimate-content {
  flex: 1;
}

.estimate-image {
  margin: 10px auto;
  text-align: center;
}

.estimate-image img {
  width: 50px;
  height: 50px;
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

/* 작은 화면에서는 1열로 표시되도록 Media Query */
@media (max-width: 768px) {
  .receive-contain {
    grid-template-columns: 1fr; /* 작은 화면에서는 한 행에 1개의 카드 */
  }

  .estimate {
    padding: 2px 10px;
    box-sizing: border-box;
  }

  .estimate-card {
    flex-direction: column; /* 화면이 작아지면 세로로 배치 */
    text-align: center;
  }

  .estimate-image img {
    margin: 10px auto; /* 이미지를 가운데 정렬 */
  }

  .estimate-content {
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
