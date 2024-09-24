<template>
  <div class="inquiry-container">
    <div class="inquiry-contain">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">문의 제목</label>
          <input type="title" id="title" v-model="title" required />
        </div>

        <div class="form-group">
          <label for="email">답변받을 이메일</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="email@example.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="category">문의 유형</label>
          <select id="category" v-model="category" required>
            <option disabled value="">카테고리 선택</option>
            <option
              v-for="(option, index) in filteredCategories"
              :key="index"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="content">문의 내용</label>
          <textarea
            id="content"
            v-model="content"
            maxlength="1000"
            placeholder="내용을 입력하세요."
            @input="updateCharacterCount"
            required
          ></textarea>
          <div class="character-count">{{ content.length }}/1000</div>
        </div>

        <div class="button-group">
          <button type="submit" class="submit-button">문의하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      category: "",
      content: "",
      userCategories: [
        { label: "일반 문의", value: "GENERAL" },
        { label: "결제 문제", value: "PAYMENT" },
        { label: "탐정 신고 관련", value: "DETECTIVE_ISSUE" },
        { label: "기타", value: "ETC" },
      ],
      detectiveCategories: [
        { label: "일반 문의", value: "GENERAL" },
        { label: "결제 문제", value: "PAYMENT" },
        { label: "사용자 신고 관련", value: "USER_ISSUE" },
        { label: "기타", value: "ETC" },
      ],
    };
  },
  computed: {
    roles() {
      return this.$store.getters.getRoles; // Vuex에서 getRoles를 가져옴
    },
    filteredCategories() {
      return this.roles === "ROLE_DETECTIVE"
        ? this.detectiveCategories
        : this.userCategories;
    },
  },
  methods: {
    goBack() {
      if (this.roles === "ROLE_DETECTIVE") {
        this.$router.push("/detective/mypage");
      } else {
        this.$router.push("/mypage");
      }
    },
    async handleSubmit() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const inqueryData = {
          title: this.title,
          email: this.email,
          category: this.category,
          content: this.content,
        };

        console.log(inqueryData);

        const response = await axios.post("api/inquery/insert", inqueryData);

        if (response.status === 200) {
          alert("문의가 성공적으로 접수되었습니다");
          this.resetForm();
        }
      } catch (error) {
        console.log(error);
      }
    },
    resetForm() {
      this.title = "";
      this.email = "";
      this.category = "";
      this.content = "";
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
  margin-bottom: 13px;
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
  margin: 25px 50px;
}

.form-group {
  margin-bottom: 30px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2c2b2b;
  margin-bottom: 10px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 13px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box; /* 패딩과 보더를 포함한 크기 설정 */
}

.form-group select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.form-group textarea {
  resize: none;
  height: 165px;
}

.character-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.button-group {
  text-align: center;
}

.submit-button {
  width: 100%;
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 11px 0px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
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
