<template>
  <div>
    <h2>탐정의 결제 화면</h2>
    <button @click="handlePayment(100)">₩100 결제</button>
    <button @click="handlePayment(10000)">₩10,000 결제</button>
    <button @click="handlePayment(50000)">₩50,000 결제</button>
    <button @click="handlePayment(100000)">₩100,000 결제</button>
    <button @click="handlePayment(300000)">₩300,000 결제</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: null,
      role: null,
      email: null,
      phonenumber: null,
    };
  },
  mounted() {
    this.fetchUserInfo();
  },
  methods: {
    fetchUserInfo() {
      const token = localStorage.getItem("token");
      console.log("fetchIserinfo : " + token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .get("/api/member/getdetail")
        .then((response) => {
          this.username = response.data.username;
          this.role = response.data.role;
          this.email = response.data.email;
          this.phonenumber = response.data.phonenumber;
        })
        .catch((error) => {
          console.error("사용자 정보 가지고 오는 중 에러 발생 ", error);
        });
    },
    handlePayment(price) {
      const jqueryScript = document.createElement("script");
      jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
      jqueryScript.onload = () => {
        const iamportScript = document.createElement("script");
        iamportScript.src =
          "https://cdn.iamport.kr/js/iamport.payment-1.1.5.js";
        iamportScript.onload = () => {
          const imp = window.IMP;
          if (imp) {
            imp.init("imp83238481");

            imp.request_pay(
              {
                pg: "html5_inicis",
                pay_method: "card",
                merchant_uid: `merchant_${new Date().getTime()}`,
                name: `${price}원 포인트 충전`,
                amount: price, // 사용자가 선택한 금액
                buyer_email: "sun@gmail.com",
                buyer_name: "선푸름",
                buyer_tel: "010-5246-3619",
              },
              (response) => {
                if (response.success) {
                  // 결제 성공 시, 서버에 결제 정보 전송
                  axios
                    .post("/api/payment/save", {
                      impUid: response.imp_uid,
                      merchantUid: response.merchant_uid,
                      price: response.paid_amount,
                      email: response.buyer_email,
                      paymentDetail: `${price}원 포인트 충전`,
                    })
                    .then((res) => {
                      alert("결재 및 저장 완료!");

                      if (res.data.success) {
                        // 결제 완료 후, 결과 페이지로 이동
                        this.$router.push({
                          name: "PaymentResult",
                          params: {
                            transactionId: res.data.data.transactionId,
                            paymentDetails: res.data.data.paymentDetails,
                            paymentTime: res.data.data.paymentTime,
                            price: res.data.data.price,
                          },
                        });
                      } else {
                        alert("결제 정보 저장 실패");
                      }
                    })
                    .catch((error) => {
                      alert("결제 정보 저장 실패 : " + error);
                    });
                } else {
                  alert(`결제 실패 : ${response.error_msg}`);
                }
              }
            );
          }
        };
        document.head.appendChild(iamportScript);
      };
      document.head.appendChild(jqueryScript);
    },
  },
};
</script>

<style scoped>
/* 추가적인 스타일 필요시 여기에 작성 */
</style>
