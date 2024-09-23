<template>
  <div class="response-container">
    <header class="response-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>답변서 작성</h2>
      <span class="header-span">의뢰에 대한 답변서를 작성해주세요</span>
    </header>

    <div class="response-contain">
      <form @submit.prevent="replyRequest">
        <div class="response-main">
          <div class="request-card">
            <div class="request-image">
              <img src="/images/request.png" alt="Placeholder Image" />
            </div>
            <div class="request-content">
              <div class="request">
                <h4>
                  {{ requests.title }}
                  <span class="request-nametag">의뢰서</span>
                </h4>
                <div class="request-date">
                  <div>✔️ 의뢰 일자 : {{ requests.createAt }}</div>
                  <div>✔️ 의뢰 분야 : {{ requests.speciality }}</div>
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
              <label for="title">예상 금액</label>
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

            <button type="submit" class="submit-button">
              <div class="submit-div">
                <span>답변서 전송</span>
                <span>💰 -1000</span>
              </div>
            </button>
          </div>
        </div>
      </form>
    </div>
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
    goBack() {
      this.$router.go(-1);
    },
    async getRequestDetail() {
      try {
        const response = await axios.get("/api/request/detail", {
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
        await axios.post("/api/estimate", {
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
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
  },
};
</script>

<style scoped>
.response-container {
  font-family: Arial, sans-serif;
}

.response-header {
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

.header-span {
  color: #666;
  font-size: 12px;
  margin: 5px 0 0 5px;
}

.response-contain {
  margin: 25px 20px;
}

.request-card {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 25px 25px;
  border-radius: 8px;
  border: 1px solid #8080803b;
}

.request-image img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

.request-nametag {
  border: 1px solid #8080804d;
  padding: 4px 7px;
  font-size: 11px;
  background-color: #f7f284d4;
  border-radius: 20px;
}

.request-content {
  width: 94%;
}

.request-content h4 {
  color: #2a2929d6;
  margin-top: 0px;
  margin-bottom: 10px;
  font-size: 16px;
}

.request-date {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 16px;
}

.request-date div {
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
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.submit-div {
  display: flex;
  justify-content: end;
  gap: 150px;
  margin-right: 26px;
}

.submit-div span:nth-child(2) {
  color: #ecb900;
  font-size: 15px;
  letter-spacing: 1px;
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

  .header-span {
    color: #666;
    font-size: 11px;
    margin: 5px 0 0 5px;
  }

  .response-contain {
    margin: 20px 14px;
  }

  .response-page-contatiner {
    padding: 15px;
  }

  p {
    font-size: 11px;
  }

  .submit-div {
    display: flex;
    justify-content: end;
    gap: 102px;
    margin-right: 15px;
  }

  .submit-div span:nth-child(2) {
    color: #ecb900;
    font-size: 10px;
    letter-spacing: 1px;
  }

  .request-card {
    padding: 17px;
  }

  .request-image img {
    width: 35px;
    height: 35px;
  }

  .request-content h4 {
    font-size: 13px;
  }

  .request-date div {
    font-size: 12px;
    color: #666;
  }

  .request-nametag {
    border: 1px solid #8080804d;
    padding: 3px 4px;
    font-size: 10px;
    background-color: #f7f284d4;
    border-radius: 20px;
  }

  .request-card {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 20px 20px;
    border: 1px solid #8080803b;
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

@media screen and (max-width: 400px) {
  .response-page-contatiner {
    padding: 15px;
  }

  p {
    font-size: 11px;
  }

  .submit-div {
    display: flex;
    justify-content: end;
    gap: 80px;
    margin-right: 15px;
  }

  .submit-div span:nth-child(2) {
    color: #ecb900;
    font-size: 10px;
    letter-spacing: 1px;
  }

  .request-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 16px 10px 16px 16px;
    border-radius: 8px;
    border: 1px solid #8080803b;
  }

  .response-main {
    max-height: 540px;
    width: 100%;
  }

  .request-image img {
    width: 35px;
    height: 35px;
  }

  .request-content h4 {
    font-size: 12px;
  }

  .request-date div {
    font-size: 12px;
    color: #666;
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
