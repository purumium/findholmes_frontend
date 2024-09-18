<template>
  <div class="paymentlist-container">
    <header class="paymentlist-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>나의 결제 내역</h2>
    </header>
    <div class="paymentlist-contain">
      <div v-if="paymentHistory.length === 0">결제 내역이 없습니다.</div>
      <div
        v-for="(payment, index) in paymentHistory"
        :key="index"
        class="payment-box"
      >
        <div class="payment-details">
          <div class="detail-row day">
            {{ formatDate(payment.paymentAt) }}
          </div>
          <div class="detail-row">
            <span class="label">주문번호</span>
            <span class="value">{{ payment.merchantUid }}</span>
          </div>
          <div class="detail-row">
            <span class="label">결제내역</span>
            <span class="value">{{ payment.paymentDetails }}</span>
          </div>
          <div class="detail-row">
            <span class="label">결제일시</span>
            <span class="value">{{ payment.paymentAt }}</span>
          </div>
          <div class="detail-row">
            <span class="label">결제금액</span>
            <span class="value">{{ payment.price }}원</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      paymentHistory: [], // 결제 내역 데이터를 저장하는 배열
    };
  },
  methods: {
    goBack() {
      this.$router.push("/mypage");
    },
    fetchPaymentHistory() {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("token")}`;

      axios
        .get("/api/payment/history") // 결제 내역을 가지고 옴
        .then((response) => {
          this.paymentHistory = response.data; // 결제 내역 데이터를 배열에 저장
        })
        .catch((error) => {
          console.error("Error fetching payment history:", error);
        });
    },
    formatDate(dateString) {
      return dateString.substring(0, 10);
    },
  },
  mounted() {
    this.fetchPaymentHistory(); // 컴포넌트가 마운트될 때 결제 내역을 불러옴
  },
};
</script>

<style>
.paymentlist-container {
  font-family: Arial, sans-serif;
}

.paymentlist-header {
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

.paymentlist-contain {
  margin: 25px 20px;
}

.payment-details {
  margin-top: 10px;
}

.payment-box {
  border: 1px solid #ccc;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #f9f9f9b3;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 11px;
  font-size: 12px;
}

.day {
  border-bottom: 1px solid #cccccc96;
  padding-bottom: 8px;
  font-size: 15px !important;
  color: #8080805e;
  font-weight: 600;
}

.label {
  color: #494747;
  font-weight: bold;
}

.value {
  color: #494747;
  font-family: monospace;
}

.total-amount {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 14px 16px;
  margin-top: 30px;
  border: 1px solid #eee;
  background-color: #f7f284b3;
}
</style>
