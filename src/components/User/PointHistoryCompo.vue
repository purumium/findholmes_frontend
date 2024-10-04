<template>
  <div class="point-container">
    <header class="point-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>포인트 사용내역</h2>
    </header>

    <div class="point-contain">
      <div>포인트 사용내역</div>
      <div class="paymentlist-contain">
      <div v-if="paymentHistory.length === 0">결제 내역이 없습니다.</div>
      <div
        v-for="(payment, index) in paymentHistory"
        :key="index"
        class="payment-box"
      >
        <div class="payment-details">
          <!-- <div class="detail-row day">
            {{ formatDate(payment.paymentAt) }}
          </div> -->
          <!-- <div class="detail-row">
            <span class="label">주문내역</span>
            <span class="value">{{ payment.pointUsingType }}</span>
          </div> -->
          <div class="detail-row">
            <span class="label">결제내역</span>
            <span class="value">{{ payment.pointUsingType }}</span>
          </div>
          <div class="detail-row">
            <span class="label">사용일시</span>
            <span class="value">{{ payment.createdAt }}</span>
          </div>
          <div class="detail-row">
            <span class="label">결제금액</span>
            <span class="value">{{ payment.pointChangeAmount }}원</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { jwtDecode } from "jwt-decode"; 

export default {
  data() {
    return {
      paymentHistory: [], // 결제 내역 데이터를 저장하는 배열
    };
  },
  computed: {
    roles() {
      return this.$store.getters.getRoles; // Vuex에서 getRoles를 가져옴
    },
    userId() {
      return this.$store.getters.getId;
    }
  },
  methods: {
    goBack() {
      if (this.roles === "ROLE_DETECTIVE") {
        this.$router.push("/detective/mypage");
      } else {
        this.$router.push("/mypage");
      }
    },
    fetchPointHistory() {
      console.log(this.userId)
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      let decoded = ''
      if(token!==null){
        decoded = jwtDecode(token);

        axios.get(`/api/payment/points/${decoded.id}`) // 결제 내역을 가지고 옴
        .then((response) => {
          this.paymentHistory = response.data; // 결제 내역 데이터를 배열에 저장
          console.log(this.paymentHistory)
        })
        .catch((error) => {
          console.error("Error fetching point history:", error);
        });
      }
    },
    formatDate(dateString) {
      return dateString.substring(0, 10);
    },
  },
  mounted() {
    this.fetchPointHistory(); // 컴포넌트가 마운트될 때 결제 내역을 불러옴
  },
};
</script>

<style scoped>
.point-container {
  font-family: Arial, sans-serif;
}

.point-header {
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

.point-contain {
  margin: 25px 20px;
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
}
</style>
