<template>
  <div class="main-container">
    <section class="hero">
      <div class="hero-header-section">
        <img src="/images/logoforhome.png" />
        <div>찾아줘 홈즈의 관리자 페이지에</div>
        <div>오신 것을 환영합니다</div>
      </div>
    </section>

    <div class="middle-container">
      <section class="services">
        <h2>홈즈 승인 관리</h2>
        <div class="service-cards">
          <div class="service-card">
            <div>승인 대기중</div>
            <div>{{ pendingCount }}건</div>
          </div>
          <div class="service-card">
            <div>승인 완료</div>
            <div>{{ approvedCount }}건</div>
          </div>
          <div class="service-card">
            <div>승인 거부</div>
            <div>{{ rejectCount }}건</div>
          </div>
        </div>
      </section>

      <section class="services">
        <h2>신고 문의 관리</h2>
        <div class="service-cards">
          <div class="service-card">
            <div>일반 문의</div>
            <div>{{ pendingCount }}건</div>
          </div>
          <div class="service-card">
            <div>탐정 신고</div>
            <div>{{ approvedCount }}건</div>
          </div>
          <div class="service-card">
            <div>결제 문의</div>
            <div>{{ rejectCount }}건</div>
          </div>
        </div>
      </section>
    </div>

    <footer class="footer-container">
      <div class="footer-content">
        <p>(05717) 서울특별시 송파구 중대로 135, 서관 12층</p>
        <p>
          대표전화: 02-2188-6900 | 정회원 전용 상담센터: 1833-2546 | 사업자번호:
          214-82-04799
        </p>
        <p>ⓒ2024 Korea Software Industry Association. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      totalArrpovals: null,
      approvedCount: null,
      pendingCount: null,
      rejectCount: null,
    };
  },
  mounted() {
    this.approvalStatus();
  },
  methods: {
    async approvalStatus() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get("/api/admin/approvals");
        const approvals = response.data; // 배열로 추가

        this.totalArrpovals = approvals.length;

        this.approvedCount = approvals.filter(
          (approval) => approval.approvalStatus === "APPROVED"
        ).length;

        this.pendingCount = approvals.filter(
          (approval) => approval.approvalStatus === "PENDING"
        ).length;

        this.rejectCount = approvals.filter(
          (approval) => approval.approvalStatus === "REJECTED"
        ).length;
      } catch (error) {
        console.log(`데이터 가지고 오는 도중 오류 발생 : ${error}`);
      }
    },
  },
};
</script>

<style scoped>
.main-container {
  width: 100%;
  margin: 0 auto;
  padding: 0 0;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #ffd40073;
}

.hero-header-section {
  padding: 30px;
  text-align: center;
}

.hero-header-section img {
  width: 100px;
}

.hero-header-section div {
  font-size: 12px;
  margin-top: 6px;
}

.services {
  text-align: center;
  padding: 16px 0;
  width: 100%;
}

.service-cards {
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.service-card {
  background-color: #c4c2ba17;
  border-radius: 7px;
  padding: 25px 15px;
  width: 25%;
  min-width: 150px;
  flex-shrink: 0;
}

.service-card img {
  margin-bottom: 10px;
  height: 150px;
  width: 150px;
}

.service-card div {
  font-size: 12px;
  color: #190404;
  margin: 5px 0;
}

.middle-container {
  margin: 10px 0px 40px 0;
}

.footer-container {
  background-color: #f0f0f596;
  padding: 20px 20px;
  font-size: 11px;
  color: #333;
  position: relative;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
}

.footer-content p {
  margin: 9px 0;
  color: #847878;
}

.footer-content p:first-child {
  font-weight: bold;
}

.footer-content p:last-child {
  margin-top: 100px;
  font-size: 12px;
  color: #999999c9;
}

/* 미디어 쿼리 사용: 작은 화면에 적용 */
@media screen and (max-width: 768px) {
  .header-section h1 {
    font-size: 1.5rem; /* 제목 크기를 줄임 */
  }

  .service-cards {
    flex-direction: column; /* 세로로 쌓이도록 변경 */
    align-items: center; /* 가운데 정렬 */
  }

  .service-card {
    width: 80%; /* 카드의 너비를 80%로 변경 */
    margin-bottom: 20px; /* 카드들 사이의 간격 추가 */
  }

  .service-card img {
    height: 100px;
    width: 100px;
  }

  .service-card div {
    font-size: 14px;
  }
}

/* 미디어 쿼리 사용: 더 작은 화면 (모바일 기기) */
@media screen and (max-width: 480px) {
  .header-section h1 {
    font-size: 1.2rem; /* 제목 크기를 더 줄임 */
  }

  .service-card {
    width: 80%; /* 카드의 너비를 더 넓게 */
  }

  .service-card img {
    height: 80px;
    width: 80px;
  }

  .service-card div {
    font-size: 12px;
  }
}

.last {
  margin-top: 50px;
  color: gray;
  background-color: #f0f0f596;
  padding: 20px;
}
</style>
