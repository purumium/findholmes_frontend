<template>
  <div class="receive-container">
    <h2>견적 요청</h2>
    <!-- 요청서 목록 -->
    <div
      v-for="(assigned, index) in assignedRequests"
      :key="index"
      class="response-card"
      @click="console.log(assigned)"
    >
      <div class="response-image">
        <img src="@/assets/findholmes_logo.png" alt="Placeholder Image" />
      </div>
      <div class="response-content">
        <h4>{{ assigned.description }}</h4>
        <p>의뢰 요청 일시 : {{ assigned.createAt }}</p>
        <!-- <button @click="viewResponse(response)">견적서 보기</button> -->
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
        const response = await axios.get("/estimate", {
          baseURL: "http://localhost:8080/",
          params: { email: this.getUser },
        });
        this.assignedRequests = response.data;
        console.log(this.assignedRequests);
      } catch (error) {
        this.assignedRequests = [];
      }
    },
  },
};
</script>

<style scoped>
.receive-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
}

h3 {
  color: #666;
}

.response-card {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.response-image img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin: 20px 30px;
}

.response-content {
  flex: 1;
}

.response-content h4 {
  margin: 0;
  font-size: 16px;
}

.response-content p {
  margin: 5px 0 13px 0;
  font-size: 12px;
  color: #666;
}

button {
  background-color: #fffd7b4f;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 7px 10px;
  cursor: pointer;
  font-size: 12px;
}

/* Media Query for small devices */
@media (max-width: 768px) {
  h2 {
    font-size: 20px;
  }

  .response-card {
    flex-direction: column; /* 화면이 작아지면 세로로 배치 */
    text-align: center;
  }

  .response-image img {
    margin: 10px auto; /* 이미지를 가운데 정렬 */
  }

  .response-content {
    margin-top: 10px;
  }

  .response-content h4 {
    font-size: 14px;
  }

  .response-content p {
    font-size: 12px;
  }

  button {
    font-size: 10px;
    padding: 5px 8px;
  }
}
</style>
