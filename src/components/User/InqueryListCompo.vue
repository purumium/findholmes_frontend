<template>
  <div class="inquiry-container">
    <div class="inquiry-contain">
      <div class="top-title">나의 문의 보기</div>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th class="text-title">제목</th>
            <th>작성일자</th>
            <th>답변상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(inquiry, index) in inquiries" :key="index">
            <td>{{ index + 1 }}</td>
            <td class="text-title" @click="goDetailInquery(inquiry.inqueryId)">
              {{ inquiry.title }}
            </td>
            <td>{{ formatDate(inquiry.createdAt) }}</td>
            <td
              :class="{
                'status-pending': inquiry.responseStatus === '답변대기',
                'status-complete': inquiry.responseStatus === '답변완료',
              }"
            >
              {{ inquiry.responseStatus }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      inquiries: [],
    };
  },
  computed: {
    roles() {
      return this.$store.getters.getRoles; // Vuex에서 getRoles를 가져옴
    },
  },
  mounted() {
    this.fetchInqueries();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async fetchInqueries() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get(
          "https://findmyholmes.store/inquery/listbyuser"
        );

        this.inquiries = response.data.map((inquery) => ({
          ...inquery,
          responseStatus:
            inquery.responseStatus === "PENDING" ? "답변대기" : "답변완료",
        }));

        console.log(this.inquiries);
      } catch (error) {
        console.log(error);
      }
    },
    async goDetailInquery(inqueryId) {
      if (this.roles === "ROLE_DETECTIVE") {
        this.$router.push({
          name: "DetectiveInqueryDetail",
          params: { inqueryid: inqueryId },
        });
      } else if (this.roles === "ROLE_USER")
        this.$router.push({
          name: "UserInqueryDetail",
          params: { inqueryid: inqueryId },
        });
    },
    formatDate(dateString) {
      const converttime = new Date(dateString);
      const year = String(converttime.getFullYear()).slice(-2); // 두 자리 연도로 변환
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
.inquiry-container {
  font-family: Arial, sans-serif;
}

.top-title {
  text-align: center;
  font-size: 18px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: 600;
}

.inquiry-header {
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

.inquiry-contain {
  margin: 40px 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.text-title {
  width: 280px;
}

th,
td {
  padding: 12px 10px;
  border-bottom: 1px solid #ccc;
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  font-size: 12px;
}

th {
  background-color: #f4f4f4;
}

.status-pending {
  color: #ecb900;
  font-size: 12px;
}

.status-complete {
  color: #4caf50;
  font-size: 12px;
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
