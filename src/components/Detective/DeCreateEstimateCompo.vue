<template>
  <div class="response-page-contatiner">
    <div>
      <h2>답변서</h2>
      <p>사용자의 의뢰에 대한 답변서를 작성해주세요</p>
    </div>
    <form @submit.prevent="replyRequest">
      <div class="response-main">
        <div class="receive-list">
          <div class="estimate-card">
            <div class="estimate-image">
              <img src="/images/request.png" alt="Placeholder Image" />
            </div>
            <div class="estimate-content">
              <div class="estimate">
                <h4>{{ requests.title }}</h4>
                <div class="estimate-date">
                  <div># 요청일자 : {{ requests.createAt }}</div>
                  <div># 요청분야 : {{ requests.speciality }}</div>
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
            <label for="price">금액</label>
            <input
              type="number"
              id="price"
              v-model="price"
              class="no-spinner"
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

          <button type="submit" class="submit-button">견적서 전송하기</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  props: ["requestId"],
  data() {
    return {
      title: "",
      description: "",
      price: "",
      requests: this.getRequestDetail(),
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  async created() {
    await this.getRequestDetail();
  },
  methods: {
    async getRequestDetail() {
      try {
        const response = await axios.get("/receive/detail", {
          baseURL: "http://localhost:8080/",
          params: { requestId: this.requestId },
        });
        this.requests = response.data;
        this.requests.createAt = this.timeconvert(this.requests.createAt);
        console.log(this.requests);
      } catch (error) {
        this.requests = [];
      }
    },
    async replyRequest() {
      try {
        await axios.post("/api/reply", {
          requestId: this.requestId,
          title: this.title,
          price: parseInt(this.price, 10),
          email: this.getUser,
          description: this.description,
        });
        alert("답변서를 전송하였습니다.");
        this.$router.push("/detective/estimatelist");
      } catch (error) {
        return;
      }
    },
    click() {
      console.log(this.requests);
    },
    timeconvert(time) {
      const converttime = new Date(time);
      const year = converttime.getFullYear();
      const month = String(converttime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(converttime.getDate()).padStart(2, "0");
      const hour = String(converttime.getHours()).padStart(2, "0");
      const minute = String(converttime.getMinutes()).padStart(2, "0");
      return `${year}년${month}월${day}일 ${hour}시${minute}분`;
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
  /* display: flex; */
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

.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
