<template>
  <div class="response-page-contatiner">
    <div>
      <h2>답변서</h2>
      <p>사용자의 의뢰에 대한 답변서를 작성해주세요</p>
    </div>

    <div class="response-main">
      <div class="receive-list">
        <div
          v-for="(request, index) in requests"
          :key="index"
          class="estimate-card"
        >
          <div class="estimate-image">
            <img src="/images/request.png" alt="Placeholder Image" />
          </div>
          <div class="estimate-content">
            <div class="estimate">
              <h4>{{ request.title }}</h4>
              <div class="estimate-date">
                <div># 요청일자 : {{ request.date }}</div>
                <div># 요청분야 : {{ request.speciality }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="response-form">
        <div class="form-group">
          <label for="title">제목</label>
          <input
            type="text"
            id="title"
            v-model="title"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div class="form-group">
          <label for="amount">금액</label>
          <input
            type="text"
            id="amount"
            v-model="amount"
            placeholder="금액을 입력하세요"
          />
        </div>

        <div class="form-group">
          <label for="description">의뢰 내용</label>
          <textarea
            id="description"
            v-model="description"
            placeholder="의뢰 내용에 맞춰서 작성해주세요"
          ></textarea>
        </div>

        <button @click="submitResponse" class="submit-button">
          견적서 전송하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requests: [
        {
          title: "제 돈 떼 먹은 놈을 찾아주세요",
          date: "2024-08-30",
          speciality: "사람찾기",
        },
      ],
    };
  },
  methods: {
    submitResponse() {
      // Add your submit logic here (for example, axios call)
      console.log("Quotation Submitted");
      console.log("Amount:", this.amount);
      console.log("Description:", this.description);
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: -10px;
}

p {
  text-align: center;
  color: #666;
  font-size: 13px;
  margin-bottom: 25px;
}

.response-page-contatiner {
  padding: 30px 20px;
  max-width: 600px;
  margin: auto;
}

.estimate {
  border: 1px solid #80808052;
  padding: 12px 0px 12px 15px;
  max-width: 400px;
  width: 400px;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 11px;
  transition: background-color 0.4s ease;
}

.estimate-card {
  display: flex;
  align-items: center;
  margin: 30px 20px;
  /* justify-content: center; */
  /* background-color: #bbb4b41a; */
  /* padding: 12px 10px; */
  /* margin-bottom: 20px; */
  /* border: 1px solid #8080803b; */
}

.estimate-image img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin: 20px 30px;
}

.estimate-content {
  flex: 1;
}

.estimate-content h4 {
  color: #2a2929d6;
  margin: 0;
  font-size: 14px;
}

.estimate-date {
  display: flex;
  gap: 14px;
  align-items: end;
  margin-top: 4px;
}

.estimate-date div {
  font-size: 12px;
  color: #666;
}

.response-main {
  border: 1px solid #80808040;
  height: 600px;
}

.response-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 1em;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 95%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.submit-button {
  padding: 10px 20px;
  background-color: #eae54b;
  color: rgb(28, 5, 5);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #eae54bd3;
}
</style>
