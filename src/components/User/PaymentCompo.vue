<template>
  <div class="payment-container">
    <header class="payment-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>포인트 결제하기</h2>
    </header>
    <div class="payment-contain">
      <div class="payment-option" @click="handlePayment(100)">
        <div>
          <div class="payment-cash">100 캐시</div>
          <div class="payment-bonus">보너스 캐시</div>
          <div class="payment-discount">적립</div>
        </div>
        <div class="price">100원</div>
      </div>

      <div class="payment-option" @click="handlePayment(1000)">
        <div>
          <div class="payment-cash">1,000 캐시</div>
          <div class="payment-bonus">보너스 캐시</div>
          <div class="payment-discount">적립</div>
        </div>
        <div class="price">1,000원</div>
      </div>

      <div class="payment-option" @click="handlePayment(5000)">
        <div>
          <div class="payment-cash">5,000캐시</div>
          <div class="payment-bonus">보너스 캐시</div>
          <div class="payment-discount">적립</div>
        </div>
        <div class="price">5,000원</div>
      </div>

      <div class="payment-option" @click="handlePayment(10000)">
        <div>
          <div class="payment-cash">10,000 캐시</div>
          <div class="payment-bonus">보너스 캐시</div>
          <div class="payment-discount">적립</div>
        </div>
        <div class="price">10,000원</div>
      </div>

      <div class="payment-option" @click="handlePayment(50000)">
        <div>
          <div class="payment-cash">50,000 캐시</div>
          <div class="payment-bonus">보너스 캐시</div>
          <div class="payment-discount">적립</div>
        </div>
        <div class="price">50,000원</div>
      </div>
    </div>
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
      token: null, // 로컬스토리지에서 토큰을 저장할 변수
    };
  },
  mounted() {
    this.fetchUserInfo(); // 컴포넌트 마운트 시 유저 정보 가져오기
  },
  methods: {
    goBack() {
      this.$router.push("/mypage");
    },
    // 유저 정보 가져오는 함수
    fetchUserInfo() {
      this.token = localStorage.getItem("token"); // 로컬스토리지에서 토큰을 가져옴

      if (this.token) {
        // 토큰이 존재하는 경우, Axios의 Authorization 헤더에 토큰을 추가
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        console.error("토큰을 찾을 수 없습니다.");
      }

      // Axios 요청으로 사용자 정보 가져오기
      axios
        .get("/api/member/userinfo")
        .then((response) => {
          // 서버에서 사용자 정보 받아와서 저장
          this.username = response.data.userName;
          this.role = response.data.role;
          this.email = response.data.email;
          this.phonenumber = response.data.phoneNumber;

          console.log(
            `결제 데이터 : ${this.username},  ${this.role},  ${this.email},  ${this.phonenumber} `
          );
        })
        .catch((error) => {
          console.error("사용자 정보 가지고 오는 중 에러 발생 ", error);
        });
    },
    // 결제 처리 함수
    handlePayment(price) {
      alert(`${price}원 결제를 처리합니다.`);

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
                buyer_email: this.email,
                buyer_name: this.username,
                buyer_tel: this.phonenumber,
              },
              (response) => {
                if (response.success) {
                  // 결제 성공 시, 서버에 결제 정보 전송
                  axios
                    .post(
                      "/api/payment/charge",
                      {
                        impUid: response.imp_uid,
                        merchantUid: response.merchant_uid,
                        price: response.paid_amount,
                        email: response.buyer_email,
                        paymentDetail: `${price}원 포인트 충전`,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${this.token}`, // 저장한 토큰을 헤더에 포함
                        },
                      }
                    )
                    .then((res) => {
                      console.log(
                        `결제 데이터 : ${res.data.merchantUid},  ${res.data.paymentDetails},  ${res.data.paymentAt},  ${res.data.price} `
                      );

                      alert("결제 및 저장 완료!");

                      // 결제 후 결과 페이지로 이동
                      this.$router.push({
                        name: "paymentResult",
                        query: {
                          merchantUid: res.data.merchantUid,
                          paymentDetails: res.data.paymentDetails,
                          paymentAt: res.data.paymentAt,
                          price: res.data.price,
                        },
                      });
                    })
                    .catch((error) => {
                      alert("결제 정보 저장 실패 : " + error);
                    });
                } else {
                  // 결제 실패 시 메시지 출력
                  alert(`결제 자체의 실패 : ${response.error_msg}`);
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
  margin: 45px auto;
  max-width: 500px;
}

.payment-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.payment-option:hover {
  background-color: #e0e0e0;
}

.payment-option.special {
  background-color: #ffeaea;
  border-left: 5px solid #ff6b6b;
}

.payment-bonus {
  font-size: 14px;
  color: #8c8c8c;
}

.payment-cash {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.payment-discount {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 14px;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.special-tag {
  position: absolute;
  top: -10px;
  left: 0;
  background-color: #ff6b6b;
  color: #fff;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 12px;
}
</style>
