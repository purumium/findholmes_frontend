<template>
  <div>
    <div class="inquiry-container">
      <header class="inquiry-header" @click="goBack">
        <button class="back-button">&lt;</button>
        <h2>사용자 결제 현황</h2>
        <span class="header-span"></span>
      </header>

      <div class="inquiry-contain">
        <!-- 총합 금액 표시 -->
        <div class="services">
          <h4 style="margin: 14px">
            {{ selectedYear }}년 {{ selectedMonth }}월 총 결제 금액 현황
          </h4>
          <div class="service-cards">
            <div class="service-card">
              <div class="total">사용자 총 합계</div>
              <div>
                <strong>{{ userTotalSum.toLocaleString() }}원</strong>
              </div>
            </div>
            <div class="service-card">
              <div class="total">홈즈 총 합계</div>
              <div>
                <strong>{{ detectiveTotalSum.toLocaleString() }}원</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="selection">
          <select id="year-select" v-model="selectedYear" @change="filterData">
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <label for="year-select">년 </label>

          <select
            id="month-select"
            v-model="selectedMonth"
            @change="filterData"
          >
            <option
              v-for="month in availableMonths"
              :key="month"
              :value="month"
            >
              {{ month }}
            </option>
          </select>
          <label for="month-select">월</label>
        </div>

        <!-- 월별 총합 그래프 -->
        <canvas id="roleTotalPriceChart"></canvas>

        <!-- 탐정 일별 그래프 -->
        <canvas id="roleDetectiveDailyPriceChart"></canvas>

        <!-- 사용자 일별 그래프 -->
        <canvas id="roleUserDailyPriceChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js/auto"; // Chart.js 전체를 가져오기
import axios from "axios";

export default {
  data() {
    return {
      totalChart: null, // 월별 총합 차트 객체
      detectiveDailyChart: null, // 탐정 일별 차트 객체
      userDailyChart: null, // 사용자 일별 차트 객체
      userCount: [], // 서버로부터 받아온 데이터
      filteredData: [], // 필터링된 데이터
      selectedYear: new Date().getFullYear(), // 현재 연도로 초기값 설정
      selectedMonth: String(new Date().getMonth() + 1).padStart(2, "0"), // 현재 월로 초기값 설정 (01, 02 형식)
      availableYears: [], // 사용 가능한 연도 리스트
      availableMonths: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ], // 월 리스트
      userTotalSum: 0, // 사용자 총합
      detectiveTotalSum: 0, // 탐정 총합
    };
  },
  mounted() {
    this.fetchUserCount(); // 페이지 로딩 시 사용자 결제 데이터를 가져옴
  },
  methods: {
    async fetchUserCount() {
      try {
        const response = await axios.get(
          "https://findmyholmes.store/admin/count/payments"
        ); // 서버에서 데이터 가져오기
        this.userCount = response.data; // 데이터 저장
        this.setupYears(); // 연도 리스트 설정
        this.filterData(); // 필터링된 데이터로 차트 그리기
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    },
    setupYears() {
      // 서버에서 받은 데이터의 날짜를 기반으로 사용 가능한 연도 리스트 설정
      const years = this.userCount.map((item) => item.date.split("-")[0]);
      this.availableYears = [...new Set(years)]; // 중복 제거하여 연도 리스트 설정
      if (!this.availableYears.includes(this.selectedYear)) {
        this.selectedYear = this.availableYears[0]; // 기본 선택 연도
      }
    },
    filterData() {
      // 선택된 연도와 월로 데이터를 필터링
      this.filteredData = this.userCount.filter((item) => {
        const [year, month] = item.date.split("-");
        return year === this.selectedYear && month === this.selectedMonth;
      });

      // 총합 계산
      this.calculateTotalSums();

      // 필터링된 데이터로 차트 그리기
      this.drawCharts();
    },
    calculateTotalSums() {
      // 사용자 총합 계산
      this.userTotalSum = this.filteredData.reduce(
        (sum, item) => sum + item.userTotalPrice,
        0
      );
      // 탐정 총합 계산
      this.detectiveTotalSum = this.filteredData.reduce(
        (sum, item) => sum + item.detectiveTotalPrice,
        0
      );
    },
    drawCharts() {
      // 월별 총합 차트 그리기
      if (this.totalChart) {
        this.totalChart.destroy(); // 이미 차트가 존재하면 먼저 파괴
      }

      const ctx1 = document
        .getElementById("roleTotalPriceChart")
        .getContext("2d");
      this.totalChart = new Chart(ctx1, {
        type: "bar", // 막대그래프 유형 설정
        data: {
          labels: ["사용자 총합", "홈즈 총합"], // 사용자와 탐정에 대한 레이블
          datasets: [
            {
              label: `${this.selectedYear}년 ${this.selectedMonth}월 총합 금액`,
              data: [this.userTotalSum, this.detectiveTotalSum], // 사용자와 탐정 총합 금액
              backgroundColor: [
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 99, 132, 0.2)",
              ], // 각 데이터의 배경색
              borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"], // 각 데이터의 테두리색
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "단위 (원)", // Y축 제목 설정
              },
            },
          },
        },
      });

      // 사용자 일별 그래프 그리기
      if (this.userDailyChart) {
        this.userDailyChart.destroy(); // 이미 차트가 존재하면 먼저 파괴
      }

      const userDates = this.filteredData.map((item) => item.date); // 사용자 날짜 레이블 설정
      const userTotalPrices = this.filteredData.map(
        (item) => item.userTotalPrice
      ); // 사용자 총합 데이터

      const ctx3 = document
        .getElementById("roleUserDailyPriceChart")
        .getContext("2d");
      this.userDailyChart = new Chart(ctx3, {
        type: "line", // 라인 그래프 유형 설정
        data: {
          labels: userDates, // 사용자 날짜 레이블
          datasets: [
            {
              label: "사용자 일별 총합 금액",
              data: userTotalPrices,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "단위 (원)", // Y축 제목 설정
              },
            },
          },
        },
      });

      // 탐정 일별 그래프 그리기
      if (this.detectiveDailyChart) {
        this.detectiveDailyChart.destroy(); // 이미 차트가 존재하면 먼저 파괴
      }

      const detectiveDates = this.filteredData.map((item) => item.date); // 탐정 날짜 레이블 설정
      const detectiveTotalPrices = this.filteredData.map(
        (item) => item.detectiveTotalPrice
      ); // 탐정 총합 데이터

      const ctx2 = document
        .getElementById("roleDetectiveDailyPriceChart")
        .getContext("2d");
      this.detectiveDailyChart = new Chart(ctx2, {
        type: "line", // 라인 그래프 유형 설정
        data: {
          labels: detectiveDates, // 탐정 날짜 레이블
          datasets: [
            {
              label: "홈즈 일별 총합 금액",
              data: detectiveTotalPrices,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "단위 (원)", // Y축 제목 설정
              },
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.inquiry-container {
  font-family: Arial, sans-serif;
}

.inquiry-header {
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

.inquiry-contain {
  margin: 30px 20px;
}

.selection {
  text-align: end;
  margin-bottom: -15px;
}

select {
  padding: 8px;
  font-size: 14px;
  border-radius: 10px;
  margin-right: 4px;
  border: 1px solid #80808069;
}

label {
  font-size: 13px;
}

.services {
  text-align: center;
  padding: 16px 0;
  width: 100%;
  border: 1px solid #80808036;
  border-radius: 10px;
  background-color: #8080800a;
  margin: 30px 0 40px 0;
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

canvas {
  max-width: 100%;
  max-height: 400px;
  margin: 40px 0;
}

.total-sums {
  margin: 20px 0;
  font-size: 16px;
}

.total-sums p {
  margin: 5px 0;
}
</style>
