<template>
  <div class="main-container">
    <section class="hero">
      <div class="hero-header-section">
        <img src="/images/logoforlogin.png" />
        <div>찾아줘 홈즈의 <strong>관리자 페이지</strong>에</div>
        <div>오신 것을 환영합니다</div>
      </div>
    </section>

    <div class="middle-container">
      <section class="services">
        <div class="title">홈즈 승인 관리</div>
        <div class="service-cards">
          <div class="service-card waiting">
            <div>승인 대기중</div>
            <div class="count">{{ pendingCount }}건</div>
          </div>
          <div class="service-card">
            <div>승인 완료</div>
            <div class="count">{{ approvedCount }}건</div>
          </div>
          <div class="service-card">
            <div>승인 거부</div>
            <div class="count">{{ rejectCount }}건</div>
          </div>
        </div>
      </section>

      <section class="services">
        <div class="title">문의 관리</div>
        <div class="service-cards">
          <div class="service-card waiting">
            <div>답변 대기중</div>
            <div class="count">{{ pendingInquiryCount }}건</div>
          </div>
          <div class="service-card">
            <div>답변 완료</div>
            <div class="count">{{ completeInquiryCount }}건</div>
          </div>
          <div class="service-card">
            <div>총 문의 건수</div>
            <div class="count">{{ totalInquiryCount }}건</div>
          </div>
        </div>
      </section>

      <section class="services">
        <div class="title">{{ selectedMonth }}월 가입자 현황</div>
        <div class="service-cards">
          <div class="service-card">
            <div>사용자 가입</div>
            <div class="count">
              {{ totalMonthlyUserCount.toLocaleString() }}명
            </div>
          </div>
          <div class="service-card">
            <div>홈즈 가입</div>
            <div class="count">
              {{ totalMonthlyDetectiveCount.toLocaleString() }}명
            </div>
          </div>
          <div class="service-card waiting">
            <div>총 가입자 수</div>
            <div class="count">{{ totalInquiryCount.toLocaleString() }}명</div>
          </div>
        </div>
      </section>

      <section class="services">
        <div class="title">{{ selectedMonth }}월 결제 현황</div>
        <div class="service-cards">
          <div class="service-card">
            <div>사용자 총합</div>
            <div class="count">
              {{ userPaymentTotalSum.toLocaleString() }}원
            </div>
          </div>
          <div class="service-card">
            <div>홈즈 총합</div>
            <div class="count">
              {{ detectivePaymentTotalSum.toLocaleString() }}원
            </div>
          </div>
          <div class="service-card waiting">
            <div>총 합계</div>
            <div class="count">{{ totalPaymentSum.toLocaleString() }}원</div>
          </div>
        </div>
      </section>
    </div>
    <footer class="footer-container">
      <div class="footer-content">
        <div class="footer-title">
          <p>찾아줘홈즈 이용 안내</p>
          찾아줘홈즈는 대한민국 탐정시장의 정보비대칭을 해소하여 투명하고 공정한
          탐정시장을 만들기 위해 중개 서비스를 제공합니다. 찾아줘홈즈는 회원의
          상담내용 및 상담여부, 사건내용 및 진행여부 등에 대해 일절 관여하지
          않으며, 관련 법규를 준수합니다. 찾아줘홈즈는 탐정(사업자회원)과
          의뢰인(일반회원) 간의 중개 시스템만을 제공하며, 사업자회원이 제공하는
          서비스의 내용과 질에 대해 법적 책임을 부담하지 않습니다. 모든 상담 및
          사건 처리는 사업자회원이 독립적으로 수행하며, 각 사무소에서 개별적으로
          업무를 진행합니다. 찾아줘홈즈에 가입한 사업자회원들 간에는 어떠한
          조직적인 관계도 없습니다. 찾아줘홈즈에 표시된 사업자회원의 정보는 해당
          사업자가 직접 제공한 것이며, 무단 복제, 편집, 전시, 전송, 배포, 판매,
          방송, 공연 등으로 이용할 수 없습니다.
        </div>
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
      totalArrpovals: 0, // 홈즈 승인
      approvedCount: 0,
      pendingCount: 0,
      rejectCount: 0,
      inquiries: [], // 문의 관리
      pendingInquiryCount: 0,
      completeInquiryCount: 0,
      totalInquiryCount: 0,
      paymentCount: [], // 결제 관리
      userPaymentTotalSum: 0,
      detectivePaymentTotalSum: 0,
      totalPaymentSum: 0,
      selectedYear: new Date().getFullYear(), // 현재 연도로 초기값 설정
      selectedMonth: new Date().getMonth() + 1, // 현재 월을 자동으로 설정
      userCount: [], // 가입자 관리
      totalMonthlyUserCount: 0,
      totalMonthlyDetectiveCount: 0,
      totalMonthlyCount: 0,
    };
  },
  mounted() {
    this.fetchApprovalStatus();
    this.fetchInqueriesCount();
    this.fetchUserCount();
    this.fetchPaymentData();
  },
  methods: {
    async fetchApprovalStatus() {
      // 홈즈 승인 등록 관리 건수
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get(
          "https://findmyholmes.store/admin/approvals"
        );
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
        console.log(error);
      }
    },
    async fetchInqueriesCount() {
      // 문의 관리: 답변대기와 답변완료 개수 계산
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get(
          "https://findmyholmes.store/admin/inquery/all"
        );
        this.inquiries = response.data;

        this.pendingInquiryCount = this.inquiries.filter(
          (inquiry) => inquiry.responseStatus === "PENDING"
        ).length;

        this.completeInquiryCount = this.inquiries.filter(
          (inquiry) => inquiry.responseStatus === "COMPLETE"
        ).length;

        this.totalInquiryCount = this.inquiries.filter(
          (inquiry) => inquiry.responseStatus
        ).length;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPaymentData() {
      // 포인트 결제 관리 현황
      try {
        const response = await axios.get(
          "https://findmyholmes.store/admin/count/payments"
        );
        this.paymentCount = response.data;

        this.filterPaymentData();
      } catch (error) {
        console.error(error);
      }
    },
    filterPaymentData() {
      const filteredData = this.paymentCount.filter((item) => {
        const [year, month] = item.date.split("-");
        return (
          year === this.selectedYear.toString() &&
          month === this.selectedMonth.toString()
        );
      });

      this.calculateTotalPaymentSums(filteredData);
    },
    calculateTotalPaymentSums(filteredData) {
      this.userPaymentTotalSum = filteredData.reduce(
        (sum, item) => sum + item.userTotalPrice,
        0
      );
      this.detectivePaymentTotalSum = filteredData.reduce(
        (sum, item) => sum + item.detectiveTotalPrice,
        0
      );
      this.totalPaymentSum =
        this.userPaymentTotalSum + this.detectivePaymentTotalSum;
    },
    async fetchUserCount() {
      // 사용자 가입 건수
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios("https://findmyholmes.store/admin/count");
        this.userCount = response.data;

        this.calculateMonthlyTotals(); // 월별 총합 계산
      } catch (error) {
        console.error(error);
      }
    },
    calculateMonthlyTotals() {
      this.totalMonthlyUserCount = this.userCount
        .filter((item) => {
          const date = new Date(item.createdAt);
          return (
            date.getFullYear() === this.selectedYear &&
            date.getMonth() + 1 === this.selectedMonth &&
            item.role === "ROLE_USER"
          );
        })
        .reduce((sum, item) => sum + item.count, 0);

      this.totalMonthlyDetectiveCount = this.userCount
        .filter((item) => {
          const date = new Date(item.createdAt);
          return (
            date.getFullYear() === this.selectedYear &&
            date.getMonth() + 1 === this.selectedMonth &&
            item.role === "ROLE_DETECTIVE"
          );
        })
        .reduce((sum, item) => sum + item.count, 0);

      this.totalMonthlyCount =
        this.totalMonthlyUserCount + this.totalMonthlyDetectiveCount;
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
  background-color: #ffd40014;
}

.hero-header-section {
  padding: 45px;
  text-align: center;
}

.hero-header-section img {
  width: 130px;
  margin-bottom: 10px;
}

.hero-header-section div {
  font-size: 14px;
  margin-top: 6px;
}

.services {
  padding: 16px 0;
  width: 100%;
  margin-bottom: 15px;
}

.service-cards {
  display: flex;
  /* gap: 12px; */
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
}

.service-card {
  text-align: center;
  background-color: #c4c2ba17;
  border-radius: 7px;
  padding: 25px 15px;
  width: 14%;
  min-width: 145px;
  flex-shrink: 0;
}

.service-card img {
  margin-bottom: 10px;
  height: 150px;
  width: 150px;
}

.service-card div {
  font-size: 14px;
  color: #190404;
  margin: 5px 0;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #2d2828;
}

.waiting {
  background-color: #ffd40040;
}

.count {
  font-size: 18px !important;
  font-weight: 600;
}

.middle-container {
  margin: 20px 20px;
}

.footer-container {
  background-color: #f0f0f596;
  min-height: 200px;
  padding: 20px 20px;
  font-size: 11px;
  color: #333;
  position: relative;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
}

.footer-title {
  color: #847878;
  line-height: 20px;
  margin-bottom: 50px;
}

.footer-content p {
  margin: 9px 0;
  color: #847878;
}

.footer-content p:first-child {
  font-weight: bold;
}

.footer-content p:last-child {
  margin-top: 20px;
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
