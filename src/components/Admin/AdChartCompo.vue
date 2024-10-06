<template>
  <div class="inquiry-container">
    <header class="inquiry-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>가입자 현황</h2>
      <span class="header-span"></span>
    </header>

    <div class="inquiry-contain">
      <div class="services">
        <h4 style="margin: 14px">
          {{ selectedYear }}년 {{ selectedMonth }}월 가입자 현황
        </h4>
        <div class="service-cards">
          <div class="service-card">
            <div class="total">사용자 가입</div>
            <div>
              <strong>{{ totalMonthlyUserCount }}명</strong>
            </div>
          </div>
          <div class="service-card">
            <div class="total">홈즈 가입</div>
            <div>
              <strong>{{ totalMonthlyDetectiveCount }}명</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="selection">
        <select v-model="selectedYear" @change="filterData">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <label for="year-select">년 </label>

        <select v-model="selectedMonth" @change="filterData">
          <option
            v-for="(month, index) in months"
            :key="index"
            :value="index + 1"
          >
            {{ month }}
          </option>
        </select>
        <label for="month-select">월</label>
      </div>

      <!-- 월별 탐정과 사용자 총합 차트 -->
      <canvas id="monthlyTotalChart" width="800" height="400"></canvas>

      <!-- 사용자 일별 가입자 차트 -->
      <canvas id="dailyUserChart" width="800" height="400"></canvas>

      <!-- 탐정 일별 가입자 차트 -->
      <canvas id="dailyDetectiveChart" width="800" height="400"></canvas>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart } from "chart.js/auto";
import moment from "moment"; // 주별 계산을 위해 moment.js 사용

export default {
  data() {
    return {
      userCount: [], // 전체 데이터
      filteredData: [], // 필터링된 데이터
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      years: [],
      months: [
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
      ],
      detectiveDailyChart: null,
      userDailyChart: null,
      monthlyTotalChart: null,
      totalMonthlyUserCount: 0, // ROLE_USER 월별 총합
      totalMonthlyDetectiveCount: 0, // ROLE_DETECTIVE 월별 총합
      isMounted: true, // 처음 mount 여부를 추적하기 위한 플래그
    };
  },
  mounted() {
    this.initializeYears();
    this.fetchUserCount();
  },
  methods: {
    initializeYears() {
      const currentYear = new Date().getFullYear();
      this.years = Array.from({ length: 10 }, (_, i) => currentYear - i);
    },
    async fetchUserCount() {
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios("https://findmyholmes.store/admin/count");
        this.userCount = response.data; // JSON 형식으로 응답 파싱

        this.calculateMonthlyTotals(); // 월별 총합 계산
        this.filterData(); // 일별 데이터를 필터링

        this.isMounted = false; // 첫 마운트 이후에는 false로 설정
      } catch (error) {
        console.error("Error fetching user count:", error);
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

      this.drawMonthlyTotalChart(); // 월별 총합 차트 그리기
    },
    filterData() {
      // 선택한 연도와 월에 따라 데이터를 필터링하고 일별로 그룹화
      const filteredData = this.userCount.filter((item) => {
        const date = new Date(item.createdAt);
        return (
          date.getFullYear() === this.selectedYear &&
          date.getMonth() + 1 === this.selectedMonth
        );
      });

      // 일별로 데이터를 그룹화
      const detectiveGroupedData = {};
      const userGroupedData = {};

      filteredData.forEach((item) => {
        const day = moment(item.createdAt).format("MM-DD"); // 일별로 그룹화
        if (item.role === "ROLE_DETECTIVE") {
          if (!detectiveGroupedData[day]) {
            detectiveGroupedData[day] = 0;
          }
          detectiveGroupedData[day] += item.count;
        } else if (item.role === "ROLE_USER") {
          if (!userGroupedData[day]) {
            userGroupedData[day] = 0;
          }
          userGroupedData[day] += item.count;
        }
      });

      this.filteredDetectiveData = Object.keys(detectiveGroupedData).map(
        (day) => ({
          day,
          count: detectiveGroupedData[day],
        })
      );

      this.filteredUserData = Object.keys(userGroupedData).map((day) => ({
        day,
        count: userGroupedData[day],
      }));

      this.drawDetectiveDailyChart(); // 탐정 일별 차트 그리기
      this.drawUserDailyChart(); // 사용자 일별 차트 그리기

      // 처음 mount가 아닌 경우에만 월별 총합을 계산
      if (!this.isMounted) {
        this.calculateMonthlyTotals();
      }
    },
    drawDetectiveDailyChart() {
      // 기존 차트가 있으면 파괴
      if (this.detectiveDailyChart) {
        this.detectiveDailyChart.destroy();
      }

      const labels = this.filteredDetectiveData.map((item) => item.day);
      const data = this.filteredDetectiveData.map((item) => item.count);

      const ctx = document
        .getElementById("dailyDetectiveChart")
        .getContext("2d");
      this.detectiveDailyChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "홈즈 일별 가입 수",
              data: data,
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
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "날짜",
              },
            },
            y: {
              title: {
                display: true,
                text: "단위(명)",
              },
              beginAtZero: true,
            },
          },
        },
      });
    },
    drawUserDailyChart() {
      // 기존 차트가 있으면 파괴
      if (this.userDailyChart) {
        this.userDailyChart.destroy();
      }

      const labels = this.filteredUserData.map((item) => item.day);
      const data = this.filteredUserData.map((item) => item.count);

      const ctx = document.getElementById("dailyUserChart").getContext("2d");
      this.userDailyChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "사용자 일별 가입 수",
              data: data,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "날짜",
              },
            },
            y: {
              title: {
                display: true,
                text: "단위(명)",
              },
              beginAtZero: true,
            },
          },
        },
      });
    },
    drawMonthlyTotalChart() {
      // 기존 차트가 있으면 파괴
      if (this.monthlyTotalChart) {
        this.monthlyTotalChart.destroy();
      }

      const ctx = document.getElementById("monthlyTotalChart").getContext("2d");
      this.monthlyTotalChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["사용자", "홈즈"],
          datasets: [
            {
              label: `${this.selectedYear}년 ${this.selectedMonth}월 총 가입 수`,
              data: [
                this.totalMonthlyUserCount,
                this.totalMonthlyDetectiveCount,
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ], // 각 데이터의 배경색
              borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"], // 각 데이터의 테두리색
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "단위(명)",
              },
              beginAtZero: true,
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
  max-width: 100%; /* 최대 너비를 800px로 설정 */
  height: 400px; /* 높이를 400px로 설정 */
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
