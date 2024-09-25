<template>
  <div class="payment-container">
    <header class="payment-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>포인트 결제하기</h2>
    </header>

    <section class="services">
      <div class="service-card" v-if="roles === 'ROLE_USER'">
        <img src="@/assets/main/service1.png" />
        <div>홈즈와의 채팅을 위한 포인트를 충전해보세요</div>
        <div>
          * 채팅 시에 <strong>답장 건수 6개 이상인 경우</strong> 1000포인트 차감
        </div>
      </div>

      <div class="service-card" v-if="roles === 'ROLE_DETECTIVE'">
        <img src="@/assets/main/service1.png" />
        <div>답변서 작성을 위한 포인트를 충전해주세요</div>
        <div>* <strong>답변서 1개 전송시 </strong>1000포인트 차감</div>
      </div>
    </section>

    <div class="payment-contain">
      <div
        class="payment-option"
        v-for="(option, index) in filteredPaymentOptions"
        :key="index"
        @click="handlePayment(option.price)"
      >
        <div>
          <div class="payment-cash">{{ option.cash }} 포인트 충전</div>
          <div class="payment-discount">{{ option.discount }}</div>
        </div>
        <div class="price">{{ option.price }}원</div>
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
      userPaymentOptions: [
        {
          cash: 100,
          discount: "적립",
          price: 100,
        },
        {
          cash: 5000,
          discount: "적립",
          price: "5,000",
        },
        {
          cash: 10000,
          discount: "적립",
          price: "10,000",
        },
        {
          cash: 30000,
          discount: "적립",
          price: "30,000",
        },
        {
          cash: 50000,
          discount: "적립",
          price: "50,000",
        },
      ],
      detectivePaymentOptions: [
        {
          cash: 100,
          discount: "적립",
          price: 100,
        },
        {
          cash: 5000,
          discount: "적립",
          price: "5,000",
        },
        {
          cash: 10000,
          discount: "적립",
          price: "10,000",
        },
        {
          cash: 50000,
          discount: "적립",
          price: "50,000",
        },
        {
          cash: 100000,
          discount: "적립",
          price: "100,000",
        },
      ],
    };
  },
  mounted() {
    this.fetchUserInfo(); // 컴포넌트 마운트 시 유저 정보 가져오기
  },
  computed: {
    roles() {
      return this.$store.getters.getRoles; // Vuex에서 getRoles를 가져옴
    },
    filteredPaymentOptions() {
      return this.roles === "ROLE_DETECTIVE"
        ? this.detectivePaymentOptions
        : this.userPaymentOptions;
    },
  },
  methods: {
    goBack() {
      if (this.roles === "ROLE_DETECTIVE") {
        this.$router.push("/detective/mypage");
      } else {
        this.$router.push("/mypage");
      }
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
                popup: true, // 결제창을 iframe으로 열기
                display: {
                  width: "100%",
                  height: "100px",
                },
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
                        `결제 데이터 : ${res.data.merchantUid},  ${res.data.paymentDetails}, 
                         ${res.data.paymentAt},  ${res.data.price} `
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

.services {
  text-align: center;
  margin-top: 20px;
}

.service-card {
  background-color: #c4c2ba17;
  padding: 15px 0;
}

.service-card img {
  height: 110px;
  width: 130px;
}

.service-card div {
  font-size: 14px;
  color: #190404;
  margin: 5px 0;
}

.payment-contain {
  margin: 30px 100px;
}

.payment-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 15px;
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

@media screen and (max-width: 768px) {
  p {
    font-size: 11px;
  }

  .payment-cash {
    font-size: 15px;
    font-weight: bold;
    color: #333;
  }
  .price {
    font-size: 17px;
    font-weight: bold;
    color: #333;
  }
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

  .payment-contain {
    margin: 30px 50px;
  }
}
</style>
