<template>
  <div class="receive-container">
    <h2>의뢰서 목록</h2>
    <p>사용자가 보낸 의뢰서에 답변서 보내기</p>
    <div class="receive-list">
      <div
        v-for="(estimate, index) in estimates"
        :key="index"
        class="estimate-card"
      >
        <div class="estimate-image">
          <img src="/images/request.png" alt="Placeholder Image" />
        </div>
        <div class="estimate-content">
          <div class="estimate" @click="viewDetailRequest()">
            <h4>{{ estimate.title }}</h4>
            <div class="estimate-date">
              <div># 받은 일자 : {{ estimate.date }}</div>
              <div># 분야 : {{ estimate.speciality }}</div>
            </div>
          </div>
          <button @click="createEstimate()">답변서 작성</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      estimates: [
        {
          title: "제 돈 떼 먹은 놈을 찾아주세요",
          date: "2024-08-30",
          speciality: "사람찾기",
        },
        {
          title: "중고거래 사기범을 잡아주세요",
          date: "2024-09-01",
          speciality: "사람찾기",
        },
        {
          title: "광주 무등산 근방의 임장을 다녀와주세요",
          date: "2024-08-30",
          speciality: "민원문제",
        },
      ],
    };
  },
  methods: {
    createEstimate() {
      this.$router.push("estimate");
    },
    viewDetailRequest() {
      this.$router.push("detailrequest");
    },
  },
};
</script>

<style scoped>
.receive-container {
  width: 100%;
  max-width: 800px;

  margin: 0 auto;
  padding: 30px 0;
}

h2 {
  text-align: center;
  margin-bottom: -10px;
}

p {
  text-align: center;
  color: #666;
  font-size: 13px;
  margin-bottom: 30px;
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

.estimate:hover {
  cursor: pointer;
  background-color: #80808013;
}

.estimate-card {
  display: flex;
  align-items: center;
  background-color: #bbb4b41a;
  padding: 20px;
  margin-bottom: 20px;
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

button {
  background-color: #efe7945e;
  border: 1px solid #d3cb3a5e;
  padding: 6px 17px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

/* Media Query for small devices */
@media (max-width: 768px) {
  h2 {
    font-size: 20px;
  }

  .estimate {
    border: 1px solid #80808052;
    padding: 10px 25px;
    max-width: 400px;
    border-radius: 20px;
    box-sizing: border-box;
    text-align: center;
  }

  .estimate-date {
    display: flex;
    gap: 14px;
    align-items: end;
    justify-content: center;
    margin-top: 4px;
  }

  .estimate-card {
    flex-direction: column; /* 화면이 작아지면 세로로 배치 */
    text-align: center;
  }

  .estimate-image img {
    margin: 10px auto; /* 이미지를 가운데 정렬 */
  }

  .estimate-content {
    margin-top: 10px;
  }

  .estimate-content h4 {
    font-size: 14px;
  }

  .estimate-content div {
    font-size: 12px;
  }

  button {
    font-size: 10px;
    padding: 5px 8px;
  }
}
</style>
