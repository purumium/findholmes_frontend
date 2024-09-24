<template>
  <div class="inquiry-container">
    <header class="inquiry-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>문의 상세 보기</h2>
      <span class="header-span"></span>
    </header>

    <div class="inquiry-contain">
      <div class="inquiry-detail-form">
        <div class="form-group">
          <label for="title">문의 제목</label>
          <input
            type="text"
            id="title"
            v-model="inquery.title"
            readonly
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="title">작성일자</label>
          <input
            type="text"
            id="title"
            :value="formatDate(inquery.createdAt)"
            readonly
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="title">작성자</label>
          <input
            type="text"
            id="title"
            v-model="inquery.writerId"
            readonly
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="email">답변받을 이메일</label>
          <input
            type="email"
            id="email"
            v-model="inquery.email"
            readonly
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="category">문의 유형</label>
          <input
            type="text"
            id="category"
            :value="formatCategory(inquery.category)"
            readonly
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="content">문의 내용</label>
          <textarea
            id="content"
            v-model="inquery.content"
            readonly
            class="form-control"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["inqueryid"],
  data() {
    return {
      inquery: {},
    };
  },
  mounted() {
    this.fetchInqueryDetail();
  },
  methods: {
    async fetchInqueryDetail() {
      try {
        const response = await axios.get(
          `/api/admin/inquery/${this.inqueryid}`
        );
        this.inquery = response.data;
      } catch (error) {
        console.error("inquery Detail 데이터 불러오기 중 오류 발생:", error);
      }
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
  margin: 30px 30px;
}

.inquiry-detail-form {
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-control {
  width: 100%;
  height: 200p;
  padding: 8px;
  background-color: #958c8c21;
  border: none;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 14px;
}

textarea.form-control {
  resize: none;
  height: 160px;
}

.character-count {
  text-align: right;
  font-size: 12px;
  color: #666;
}
</style>
