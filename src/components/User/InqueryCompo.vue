<template>
  <div class="inquiry-container">
    <header class="inquiry-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>문의하기</h2>
    </header>

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
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="message">문의 내용</label>
          <textarea
            id="message"
            v-model="message"
            maxlength="1000"
            placeholder="내용을 입력하세요."
            @input="updateCharacterCount"
            required
          ></textarea>
          <div class="character-count">{{ message.length }}/1000</div>
        </div>

        <div class="button-group">
          <button type="submit" class="submit-button">문의하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      category: "",
      message: "",
      userCategories: ["일반 문의", "결제 문제", "탐정 신고 관련", "기타"],
      detectiveCategories: [
        "일반 문의",
        "결제 문제",
        "사용자 신고 관련",
        "기타",
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
    handleSubmit() {
      alert("문의가 성공적으로 제출되었습니다.");
    },
    updateCharacterCount() {},
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
  margin: 25px 20px;
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
</style>
