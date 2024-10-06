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
            :value="timeconvert(inquery.createdAt)"
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

        <div>
          <!-- <button @click="sendEmail" class="send-email-btn"> -->
          <button @click="openModal" class="send-email-btn">
            이메일로 답변 보내기
          </button>
        </div>
      </div>

      <!-- 모달 창 -->
      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h3>문의 답변 보내기</h3>

          <div class="form-group">
            <label for="toEmail">받는 사람</label>
            <input
              type="email"
              id="toEmail"
              v-model="emailContent.to"
              readonly
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="emailSubject">제목</label>
            <input
              type="text"
              id="emailSubject"
              v-model="emailContent.subject"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="emailBody">내용</label>
            <textarea
              id="emailBody"
              v-model="emailContent.body"
              class="form-control"
            ></textarea>
          </div>

          <button @click="sendEmail" class="send-email-btn">보내기</button>
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
      isModalOpen: false, // 모달창 열림, 닫힘
      emailContent: {
        to: "",
        subject: "",
        body: "",
      },
    };
  },
  mounted() {
    this.fetchInqueryDetail();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async fetchInqueryDetail() {
      // 문의글을 불러오는 함수
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get(
          `https://findmyholmes.store/admin/inquery/${this.inqueryid}`
        );
        this.inquery = response.data;
      } catch (error) {
        console.error("inquery Detail 데이터 불러오기 중 오류 발생:", error);
      }
    },
    openModal() {
      // 모달 열 때, 문의글에 있는 이메일로 초기화
      this.emailContent.to = this.inquery.email;
      this.isModalOpen = true;
    },
    closeModal() {
      // 모달 닫기
      this.isModalOpen = false;
    },
    async sendEmail() {
      // 메일 보내기
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        await axios.post("https://findmyholmes.store/email/send", {
          to: this.emailContent.to,
          subject: this.emailContent.subject,
          body: this.emailContent.body,
        });
        // 메일 전송 후 문의글의 상태 업데이트
        await this.updateInqueryStatus();

        // 이메일 전송 후 모달 닫기
        this.closeModal();
      } catch (error) {
        console.error("Email sending failed:", error);
      }
    },
    async updateInqueryStatus() {
      // 메일 전송 후 문의글의 상태 업데이트
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        // 상태 업데이트
        const response = await axios.get(
          `https://findmyholmes.store/admin/inquery/${this.inqueryid}/status`
        );
        console.log(response.data);
      } catch (error) {
        console.log("문의 상태 업데이트 실패: ", error);
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
