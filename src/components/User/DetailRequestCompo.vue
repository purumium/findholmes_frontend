<template>
  <div class="request-form-table">
    <h2>보낸 요청서</h2>
    <p>보낸 요청서 자세히 보기</p>
    <div class="request">
      <table class="request-table">
        <!-- 의뢰내용 -->
        <tr>
          <td class="label">의뢰 제목</td>
        </tr>
        <tr>
          <td class="value">{{ request.title }}</td>
        </tr>

        <!-- 의뢰종류 -->
        <tr>
          <td class="label">의뢰 종류</td>
        </tr>
        <tr>
          <td class="value">{{ request.category }}</td>
        </tr>

        <!-- 지역 -->
        <tr>
          <td class="label">의뢰 지역</td>
        </tr>
        <tr>
          <td class="value">{{ request.location }}</td>
        </tr>

        <!-- 탐정 성별 -->
        <tr>
          <td class="label">탐정 성별</td>
        </tr>
        <tr>
          <td class="value">{{ request.gender }}</td>
        </tr>

        <!-- 상담 내용 -->
        <tr>
          <td class="label">의뢰에 대한 자세한 내용</td>
        </tr>
        <tr>
          <td class="value description">{{ request.description }}</td>
        </tr>
      </table>
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
  margin-bottom: 30px;
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
  padding: 8px 15px !important;
}

.value {
  text-align: left;
  padding: 10px 15px !important;
  font-size: 13px;
  font-family: math !important;
}

.description {
  min-height: 210px;
  height: 210px;
  padding: 10px 15px !important;
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
    padding: 5px 8px !important;
  }

  .value {
    text-align: left;
    padding: 5px 8px !important;
    font-family: emoji !important;
  }

  .request-table td {
    padding: 8px;
    font-size: 12px;
  }

  .description {
    min-height: 150px;
    height: 150px;
    padding: 10px 15px !important;
  }
}
</style>
