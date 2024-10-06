<template>
  <div class="inquiry-container">
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
            :value="timeconvert(inquery.createdAt)"
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
          <label for="status">답변상태</label>
          <input
            type="status"
            id="status"
            :value="formattedStatus"
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
  computed: {
    formattedStatus() {
      return this.inquery.responseStatus === "PENDING"
        ? "답변대기"
        : "답변완료";
    },
  },
  methods: {
    async fetchInqueryDetail() {
      // 문의글을 불러오는 함수
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get(
          `https://findmyholmes.store/inquery/${this.inqueryid}`
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
  /* padding: 20px; */
  /* border: 1px solid #ddd; */
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
  padding: 8px 12px;
  background-color: #9e9c9c21;
  border: none;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 14px;
}

textarea.form-control {
  resize: none;
  height: 160px;
  padding: 10px 12px !important;
  font-family: Arial, sans-serif;
}

.character-count {
  text-align: right;
  font-size: 12px;
  color: #666;
}

.send-email-btn {
  width: 100%;
  padding: 10px;
  border: 1px solid #eae8c1;
  border-radius: 5px;
  background-color: #ffdf3e9c;
  color: #46444a;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

/* 모달 스타일 */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  text-align: center;
}

.close {
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: red;
}
</style>
