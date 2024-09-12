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
                  <div>✔️ 의뢰 일자 : {{ requests.createAt }}</div>
                  <div>✔️ 의뢰 분야 : {{ requests.speciality }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="response-form">
          <div class="form-group">
            <label for="title">답변서 제목</label>
            <input
              type="text"
              id="title"
              v-model="title"
              placeholder="(예) 증거를 찾아드리겠습니다"
            />
          </div>

          <div class="form-group">
            <label for="title">견적 금액</label>
            <input
              type="number"
              id="price"
              v-model="price"
              class="no-spinner"
              placeholder="(예) 90,000"
            />
          </div>

          <div class="form-group">
            <label for="title">답변 내용</label>
            <textarea
              id="description"
              v-model="description"
              placeholder=""
            ></textarea>
          </div>

          <button type="submit" class="submit-button">답변서 전송</button>
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
  padding: 30px;
  max-width: 600px;
  margin: auto;
}

.estimate-card {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 25px 20px 25px 15px;
  border: 1px solid #8080803b;
}

.estimate-image img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

.estimate-content {
  width: 94%;
}

.estimate-content h4 {
  color: #2a2929d6;
  margin-top: 0px;
  margin-bottom: 10px;
  font-size: 16px;
}

.estimate-date {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 16px;
}

.estimate-date div {
  font-size: 14px;
  color: #666;
}

.response-main {
  height: 600px;
  width: 100%;
}

.response-form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.form-group {
  margin-bottom: 17px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 0px;
  background-color: #80808012;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 10px;
}

.form-group input {
  width: 100%;
  padding: 12px 10px;
  font-size: 13px;
  border: none;
  border-bottom: 1px solid #ccccccb0;
  box-sizing: border-box;
}

.form-group textarea {
  width: 100%;
  padding: 12px 10px;
  font-size: 13px;
  border: none;
  border-left: 1px solid #8080803d;
  border-right: 1px solid #8080803d;
  border-bottom: 1px solid #8080803d;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  box-sizing: border-box;
  height: 160px;
  resize: none;
}

.submit-button {
  width: 100%;
  background-color: #ffdf3e9c;
  border: 1px solid #d3cb3a5e;
  padding: 8px 0px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 480px) {
  .response-page-contatiner {
    padding: 15px;
  }

  h2 {
    font-size: 16px;
  }

  p {
    font-size: 11px;
  }

  .estimate-card[data-v-64b51341] {
    padding: 17px 10px;
  }

  .estimate-image img {
    width: 35px;
    height: 35px;
  }

  .estimate-content h4 {
    font-size: 13px;
  }

  .estimate-date {
    font-size: 12px;
  }

  .form-group input,
  .form-group textarea {
    font-size: 11px;
    padding: 8px;
  }

  .submit-button {
    font-size: 11px;
    padding: 7px 0;
  }
}
</style>
