<template>
    <div>
      <h2>Role Total Prices</h2>
  
      <div>
        <label for="year-select">Year:</label>
        <select id="year-select" v-model="selectedYear" @change="filterData">
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
  
        <label for="month-select">Month:</label>
        <select id="month-select" v-model="selectedMonth" @change="filterData">
          <option v-for="month in availableMonths" :key="month" :value="month">{{ month }}</option>
        </select>
      </div>
  
      <canvas id="rolePriceChart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart } from 'chart.js/auto'; // Chart.js 전체를 가져오기
  import axios from 'axios';
  
  export default {
    data() {
      return {
        chart: null, // 차트 객체
        userCount: [], // 서버로부터 받아온 데이터
        filteredData: [], // 필터링된 데이터
        selectedYear: '', // 선택된 연도
        selectedMonth: '', // 선택된 월
        availableYears: [], // 사용 가능한 연도 리스트
        availableMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], // 월 리스트
      };
    },
    mounted() {
      this.fetchUserCount();
    },
    methods: {
      async fetchUserCount() {
        try {
          const token = localStorage.getItem("token");
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const response = await axios.get('/api/admin/count/payments'); // 서버에서 데이터 가져오기
          this.userCount = response.data; // 데이터 저장
          this.setupYears(); // 연도 리스트 설정
          this.filterData(); // 필터링된 데이터로 차트 그리기
        } catch (error) {
          console.error('Error fetching user count:', error);
        }
      },
      setupYears() {
        // 서버에서 받은 데이터의 날짜를 기반으로 사용 가능한 연도 리스트 설정
        const years = this.userCount.map(item => item.date.split('-')[0]);
        this.availableYears = [...new Set(years)]; // 중복 제거하여 연도 리스트 설정
        this.selectedYear = this.availableYears[0]; // 기본 선택 연도
        this.selectedMonth = '01'; // 기본 선택 월
      },
      filterData() {
        // 선택된 연도와 월로 데이터를 필터링
        this.filteredData = this.userCount.filter(item => {
          const [year, month] = item.date.split('-');
          return year === this.selectedYear && month === this.selectedMonth;
        });
        this.drawChart(); // 필터링된 데이터로 차트 그리기
      },
      drawChart() {
        if (this.chart) {
          this.chart.destroy(); // 이미 차트가 존재하면 먼저 파괴
        }
  
        const labels = this.filteredData.map(item => item.date); // 날짜 레이블 설정
        const userTotalPrices = this.filteredData.map(item => item.userTotalPrice); // ROLE_USER 총합 데이터
        const detectiveTotalPrices = this.filteredData.map(item => item.detectiveTotalPrice); // ROLE_DETECTIVE 총합 데이터
  
        const ctx = document.getElementById('rolePriceChart').getContext('2d');
        this.chart = new Chart(ctx, {
          type: 'bar', // 막대그래프 유형 설정
          data: {
            labels: labels,
            datasets: [
              {
                label: 'User Total Price',
                data: userTotalPrices,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
              {
                label: 'Detective Total Price',
                data: detectiveTotalPrices,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
    },
  };
  </script>
  
  <style>
  canvas {
    max-width: 100%;
    max-height: 400px;
  }
  </style>
  