<template>
  <div class="request-form-table">
    <h2>의뢰서</h2>
    <p>사용자가 보낸 의뢰서를 확인하고 답변하기</p>
    <div class="request">
      <table class="request-table">
        <tr>
          <td class="label">의뢰 제목</td>
        </tr>
        <tr>
          <td class="value">{{ request.title }}</td>
        </tr>

        <tr>
          <td class="label">의뢰 종류</td>
        </tr>
        <tr>
          <td class="value">{{ request.category }}</td>
        </tr>

        <tr>
          <td class="label">의뢰 지역</td>
        </tr>
        <tr>
          <td class="value">{{ request.location }}</td>
        </tr>

        <tr>
          <td class="label">탐정 성별</td>
        </tr>
        <tr>
          <td class="value">{{ request.gender }}</td>
        </tr>

        <tr>
          <td class="label">의뢰 내용에 대해 자세한 설명</td>
        </tr>
        <tr>
          <td class="value description">
            <div class="content">
              {{ request.description }}
            </div>
          </td>
        </tr>
      </table>
      <div class="btn">
        <button @click="createEstimate()">의뢰에 대해 답변서 작성</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      request: {
        title: "어렸을 때 잃어버린 동생을 찾고 싶어요",
        category: "법률 상담",
        location: "서울",
        gender: "남성",
        description: "어렸을 때 잃어버린 동생을 찾고 싶어요",
      },
    };
  },
  methods: {
    createEstimate() {
      this.$router.push("estimate");
    },
  },
};
</script>

<style scoped>
.request-form-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 30px;
}

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

.request-table {
  width: 100%;
  border-collapse: collapse;
}

.request-table td {
  border: 1px solid #ddd;
  padding: 10px;
}

.label {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: left;
  font-size: 13px;
  padding: 6px 15px !important;
}

.value {
  text-align: left;
  padding: 9px 15px !important;
  font-size: 13px;
  font-family: math !important;
}

.description {
  padding: 10px 15px !important;
}

.content {
  height: 200px;
  margin: 10px 0;
}

.btn {
  margin-top: 20px;
}

button {
  background-color: #efe7945e;
  border: 1px solid #d3cb3a5e;
  padding: 8px 0px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #e9e48db2;
}

@media screen and (max-width: 768px) {
  .request-form-table {
    padding: 20px 10px;
  }

  h2 {
    font-size: 18px;
  }

  .p {
    font-size: 12px;
  }

  .label {
    background-color: #f5f5f5;
    font-weight: bold;
    text-align: left;
    padding: 7px 10px !important;
  }

  .value {
    text-align: left;
    padding: 7px 10px !important;
    font-family: emoji !important;
  }

  .request-table td {
    padding: 8px;
    font-size: 12px;
  }

  button {
    padding: 8px;
    font-size: 12px;
  }
}
</style>
