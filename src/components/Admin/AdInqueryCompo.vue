<template>
  <div class="inquiry-container">
    <header class="inquiry-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>문의 등록 관리</h2>
      <span class="header-span"></span>
    </header>

    <div class="inquiry-contain">
      <div class="inquiry-filters">
        <button
          :class="{ 'active-filter': selectedFilter === '전체' }"
          @click="setFilter('전체')"
        >
          전체
        </button>
        <button
          :class="{ 'active-filter': selectedFilter === '답변대기' }"
          @click="setFilter('답변대기')"
        >
          답변대기
        </button>
        <button
          :class="{ 'active-filter': selectedFilter === '답변완료' }"
          @click="setFilter('답변완료')"
        >
          답변완료
        </button>
      </div>

      <div class="inquiry-list">
        <div class="total-info">1 페이지</div>
        <table class="inquiry-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>분류</th>
              <th>제목</th>
              <th>글쓴이</th>
              <th>상태</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(inquiry, index) in filteredInquiries" :key="index">
              <td>{{ index + 1 }}</td>
              <td style="width: 60px">
                {{ formatCategory(inquiry.category) }}
              </td>
              <td @click="goDetailInquery(inquiry.inqueryId)">
                <span style="cursor: pointer">{{ inquiry.title }}</span>
              </td>
              <td>{{ inquiry.writerId }}</td>
              <td
                :class="{
                  'status-pending': inquiry.responseStatus === '답변대기',
                  'status-complete': inquiry.responseStatus === '답변완료',
                }"
                style="width: 48px; font-size: 11px"
              >
                {{ inquiry.responseStatus }}
              </td>
              <td style="font-size: 11px; letter-spacing: -0.5px; width: 68px">
                {{ formatDate(inquiry.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedFilter: "전체",
      inquiries: [],
    };
  },
  computed: {
    filteredInquiries() {
      // selectedFilter에 맞는 데이터를 보여줌
      if (this.selectedFilter === "전체") {
        return this.inquiries;
      }
      return this.inquiries.filter(
        (inquiry) => inquiry.responseStatus === this.selectedFilter
      );
    },
  },
  mounted() {
    this.fetchInqueries("전체");
  },
  methods: {
    goBack() {
      // 뒤로가기 로직
      this.$router.back();
    },
    setFilter(filter) {
      this.selectedFilter = filter; // 답변대기, 답변완료, 전체
      console.log("setFilter : " + filter);
      this.fetchInqueries(filter);
    },
    async fetchInqueries(filter) {
      let endpoint = "/api/admin/inquery/all"; // 전체

      if (filter === "답변대기") {
        endpoint = "/api/admin/inquery/pending";
      } else if (filter === "답변완료") {
        endpoint = "/api/admin/inquery/complete";
      }

      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get(endpoint);

        console.log(response.data);

        // 데이터에 할당, 'PENDING' 및 'COMPLETE'을 한글로 바꿔주기
        this.inquiries = response.data.map((inquery) => ({
          ...inquery,
          responseStatus:
            inquery.responseStatus === "PENDING" ? "답변대기" : "답변완료",
        }));
      } catch (error) {
        console.error("inquery 데이터 불러오기 중 오류 발생:", error);
      }
    },
    goDetailInquery(id) {
      this.$router.push(`/admin/inquery/${id}`);
    },
    formatCategory(category) {
      // 카테고리를 한글로 변환하는 함수
      switch (category) {
        case "GENERAL":
          return "일반문의";
        case "PAYMENT":
          return "결제문의";
        case "DETECTIVE_ISSUE":
          return "탐정신고";
        case "USER_ISSUE":
          return "사용자신고";
        case "ETC":
          return "기타문의";
        default:
          return category; // 예외 처리
      }
    },
    formatDate(dateString) {
      // 날짜 형식 변환 함수
      const date = new Date(dateString);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const year = String(date.getFullYear()).slice(2); // 연도의 마지막 두 자리
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${day}-${month}-${year} ${hours}:${minutes}`; // "24-09-24 11:09" 형식으로 반환
    },
  },
};
</script>

<style scoped>
.inquiry-container {
  font-family: Arial, sans-serif;
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
  margin: 20px 20px;
}

.register-button {
  background-color: #333;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #555;
}

.inquiry-filters {
  margin: 20px 0;
  display: flex;
  gap: 14px;
  justify-content: end;
}

.inquiry-filters button {
  padding: 8px 12px;
  font-size: 11px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

.inquiry-filters .active-filter {
  background-color: #333;
  color: white;
}

.inquiry-list {
  margin-top: 20px;
}

.total-info {
  margin-bottom: 10px;
  font-weight: bold;
}

.inquiry-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.inquiry-table th,
.inquiry-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  font-size: 12px;
}

.inquiry-table th {
  background-color: #f4f4f4;
}

.status-pending {
  color: #ff9800;
}

.status-complete {
  color: #4caf50;
}

.inquiry-table tbody tr:hover {
  background-color: #f1f1f1;
}
</style>
