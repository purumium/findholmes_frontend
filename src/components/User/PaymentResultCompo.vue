<template>
  <div class="payment-container">
    <header class="payment-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>최종 결제 금액 확인</h2>
    </header>

    <div class="payment-contain">
      <div class="payment-summary-wrapper">
        <div class="payment-summary-container">
          <h2 class="payment-summary-title">최종 결제 내역</h2>
          <div class="payment-details">
            <div class="detail-row">
              <span class="label">주문번호</span>
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
    </div>
  </div>
</template>

<script>
export default {
  props: ["merchantUid", "paymentDetails", "paymentAt", "price"],
  computed: {
    roles() {
      return this.$store.getters.getRoles; // Vuex에서 getRoles를 가져옴
    },
  },
  methods: {
    goBack() {
      if (this.roles === "ROLE_DETECTIVE") {
        this.$router.push("/detective/payment");
      } else {
        this.$router.push("/payment");
      }
    },
  },
};
</script>

<style scoped>
.payment-container {
  font-family: Arial, sans-serif;
}

.payment-header {
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

.payment-contain {
  margin: 0px auto;
  max-width: 555px;
}

.payment-summary-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
}

.payment-summary-container {
  width: 490px;
  height: 340px;
  padding: 40px 25px 50px 25px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  background-color: #f9f9f96b;
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
  margin-top: 30px;
  border: 1px solid #eee;
  background-color: #f7f284b3;
}

.total-amount span:first-child {
  font-size: 13px;
}

.total-price {
  color: #5c970f;
  font-weight: bold;
  font-size: 17px;
}
</style>
