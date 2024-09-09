<template>
  <div class="payment-summary-wrapper">
    <div class="payment-summary-container">
      <h2 class="payment-summary-title">최종 결제 내역</h2>
      <div class="payment-details">
        <div class="detail-row">
          <span class="label">주문 번호</span>
          <span class="value">{{ merchantUid }}</span>
        </div>
        <div class="detail-row">
          <span class="label">결제내역</span>
          <span class="value">{{ paymentDetails }}</span>
        </div>
        <div class="detail-row">
          <span class="label">결제일시</span>
          <span class="value">{{ paymentAt }}</span>
        </div>
        <div class="detail-row">
          <span class="label">결제금액</span>
          <span class="value">{{ price }}원</span>
        </div>
      </div>
      <div class="total-amount">
        <span>총 결제금액</span>
        <span class="total-price">{{ price }}원</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["merchantUid", "paymentDetails", "paymentAt", "price"],
};
</script>

<style scoped>
.payment-summary-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 66vh; /* Viewport Height: 화면 높이의 100% */
  background-color: #f0f0f0;
}

.payment-summary-container {
  width: 400px;
  padding: 40px 25px 50px 25px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  background-color: #f9f9f9c9;
  font-family: Arial, sans-serif;
}

.payment-summary-title {
  font-size: 15px;
  color: #55555570;
  padding-bottom: 12px;
  margin-bottom: 28px;
  text-align: left;
  border-bottom: 1px solid #80808045;
}

.payment-details {
  margin-bottom: 19px;
  padding-bottom: 16px;
  border-bottom: 1px solid #80808038;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 13px;
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
  margin-top: 20px;
  border: 1px solid #eee;
  background-color: #ede99c;
}

.total-amount span:first-child {
  font-size: 13px;
}

.total-price {
  color: #5c970f;
  font-weight: bold;
  font-size: 16px;
}
</style>
