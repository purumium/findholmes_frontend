<template>
  <div class="estimate-container">
    <header class="estimate-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>보낸 답변서</h2>
      <span class="header-span"></span>
    </header>

    <div class="estimate-main">
      <div class="estimate-card">
        <h1>답변서</h1>
        <div class="request-card">
          <div class="request-contain">
            <div class="request-image">
              <img
                src="/images/request.png"
                alt="Placeholder Image"
                width="30px"
                height="30px"
              />
              <span class="request-nametag">의뢰서</span>
            </div>
            <div class="request-content">
              <div class="request">
                <div
                  class="request-date"
                  @click="
                    this.$router.push(
                      `/detective/received/${estimate.requestId}`
                    )
                  "
                >
                  <div>✔️ 의뢰 제목 : {{ estimate.requestTitle }}</div>
                  <div>
                    ✔️ 의뢰 일자 : {{ timeconvert(estimate.requestCreateAt) }}
                  </div>
                  <div>✔️ 의뢰 분야 : {{ estimate.speciality }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="estimate-content">
          <div class="estimate">
            <div class="form-group">
              <label>답변서 제목</label>
              <p>{{ estimate.estimateTitle }}</p>
            </div>

            <div class="form-group">
              <label>답변 날짜</label>
              <p>{{ timeconvert(estimate.estimateCreateAt) }}</p>
            </div>

            <div class="form-group">
              <label>예상 금액</label>
              <p>{{ estimate.price }}원</p>
            </div>

            <div class="form-group">
              <label>답변 내용</label>
              <p class="reply-content">{{ estimate.description }}</p>
            </div>
          </div>
        </div>
      </div>
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
      estimate: [],
    };
  },
  created() {
    this.getEstimates();
  },
  computed: {
    ...mapGetters(["getRoles", "getId"]),
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getEstimates() {
      console.log(this.requestId);
      try {
        const response = await axios.get("/api/estimate/details", {
          params: {
            userId: this.getId,
            requestId: this.requestId,
          },
        });
        this.estimate = response.data;
        console.log("상세답변서:", this.estimate);
      } catch (error) {
        return;
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
.estimate-container {
  font-family: Arial, sans-serif;
}

.estimate-main {
  padding: 20px 18px;
}

.estimate-header {
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

h1 {
  text-align: center;
  font-size: 20px;
  letter-spacing: 5px;
}

h2 {
  margin-left: -5px;
  font-size: 16px;
  font-weight: bold;
}

.estimate-contain {
  margin: 25px 20px;
}

.header-span {
  display: block;
  font-size: 14px;
  color: #666;
}

.request-contain {
  border: 1px solid #8080802b;
  border-radius: 10px;
  padding: 13px 26px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.request-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.request-nametag {
  font-size: 12px;
  font-weight: 700;
}

.request-date {
  font-size: 13px;
  display: grid;
  gap: 5px;
}

.estimate {
  margin-top: 33px;
}

.estimate-card {
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #cccccc99;
  padding: 20px 15px;
  border-radius: 8px;
}

.estimate-image img {
  width: 39px;
  height: 34px;
  border: 1px solid #80808042;
  border-radius: 4px;
  padding: 9px;
}

.estimate-content h4 {
  font-size: 18px;
  margin: 0;
}

.estimate-content .estimate-nametag {
  background-color: #f0f0aa;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 10px;
}

.estimate-date {
  margin-top: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-group p {
  font-size: 14px;
  color: #444;
  margin-top: 8px;
  padding: 14px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.reply-content {
  font-size: 16px;
  color: #444;
  margin-top: 8px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
  min-height: 150px;
}

@media screen and (max-width: 768px) {
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

  h1 {
    text-align: center;
    font-size: 16px;
    letter-spacing: 5px;
    margin: 7px 0 12px 0;
  }

  .estimate-card {
    align-items: center;
    margin-bottom: 20px;
    border: 1px solid #cccccc99;
    padding: 20px 20px 5px 20px;
    border-radius: 8px;
  }

  .estimate-main {
    padding: 15px 11px;
  }

  .estimate {
    margin-top: 19px;
  }
  .form-group label {
    font-size: 13px;
    font-weight: 600;
    color: #333;
  }

  .form-group p {
    font-size: 12px;
    color: #444;
    margin-top: 8px;
    padding: 10px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }

  .request-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .request-nametag {
    font-size: 10px;
    font-weight: 700;
  }

  .request-date {
    font-size: 11.5px;
    display: grid;
    gap: 5px;
  }

  .request-contain {
    border: 1px solid #8080802b;
    border-radius: 10px;
    padding: 13px 15px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
}

@media screen and (max-width: 390px) {
  .request-date {
    font-size: 11.5px;
    display: grid;
    gap: 5px;
    letter-spacing: -0.5px;
  }
}
</style>
