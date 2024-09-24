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
              <td>{{ index }}</td>
              <td>{{ inquiry.category }}</td>
              <td>{{ inquiry.title }}</td>
              <td>{{ inquiry.writerId }}</td>
              <td
                :class="{
                  'status-pending': inquiry.responseStatus === '답변대기',
                  'status-complete': inquiry.responseStatus === '답변완료',
                }"
              >
                {{ inquiry.responseStatus }}
              </td>
              <td>{{ inquiry.createAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
//import axios from "axios";

export default {
  data() {
    return {
      selectedFilter: "답변대기중",
      inquiries: [],
    };
  },
  computed: {
    filteredInquiries() {
      if (this.selectedFilter === "답변대기중") {
        return this.inquiries;
      }
      return this.inquiries.filter(
        (inquiry) => inquiry.category === this.selectedFilter
      );
    },
  },
  methods: {
    setFilter(filter) {
      this.selectedFilter = filter;
    },
  },
};
</script>

<style>
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
  margin: 20px 10px;
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
  gap: 10px;
}

.inquiry-filters button {
  padding: 8px 15px;
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
