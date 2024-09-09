<template>
  <div>
    <h2>탐정의 결제 완료 페이지</h2>
    <p>결제 번호: {{ transactionId }}</p>
    <p>결제 내역: {{ paymentDetails }}</p>
    <p>결제 시간: {{ paymentTime }}</p>
    <p>결제 금액: {{ price }} 원</p>
  </div>
</template>

<script>
export default {
  props: ["transactionId", "paymentDetails", "price", "paymentTime"],
  setup(props) {
    return { ...props };
  },
};
</script>
