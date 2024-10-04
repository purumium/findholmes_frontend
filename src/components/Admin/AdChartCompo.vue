<template>
    <div>
      <div>
        <select v-model="selectedYear" @change="filterData">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
        
        <select v-model="selectedMonth" @change="filterData">
          <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
        </select>
      </div>
  
      <canvas id="roleChart" width="800" height="400"></canvas>
      <div>
        <p>ROLE_USER Count Total: {{ totalRoleUserCount }}</p>
        <p>ROLE_DETECTIVE Count Total: {{ totalRoleDetectiveCount }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { Chart } from 'chart.js/auto';
  
  export default {
    data() {
      return {
        userCount: [], // 전체 데이터
        filteredData: [], // 필터링된 데이터
        selectedYear: new Date().getFullYear(),
        selectedMonth: new Date().getMonth() + 1,
        years: [],
        months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        chart: null,
        totalRoleUserCount: 0, // ROLE_USER 총합
        totalRoleDetectiveCount: 0 // ROLE_DETECTIVE 총합
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

          const response = await axios('/api/admin/count');
          this.userCount = response.data; // JSON 형식으로 응답 파싱
          console.log(this.userCount);
          this.calculateTotals(); // 총합 계산
          this.filterData(); // 전체 데이터를 가져온 후 필터링합니다.
        } catch (error) {
          console.error('Error fetching user count:', error);
        }
      },
      calculateTotals() {
      this.totalRoleUserCount = this.userCount
        .filter(item => item.role === 'ROLE_USER')
        .reduce((sum, item) => sum + item.count, 0); // ROLE_USER 총합 계산

      this.totalRoleDetectiveCount = this.userCount
        .filter(item => item.role === 'ROLE_DETECTIVE')
        .reduce((sum, item) => sum + item.count, 0); // ROLE_DETECTIVE 총합 계산
    },
      filterData() {
        // 선택한 연도와 월에 따라 데이터를 필터링
        this.filteredData = this.userCount.filter(item => {
          const date = new Date(item.createdAt);
          return date.getFullYear() === this.selectedYear && (date.getMonth() + 1) === this.selectedMonth;
        });
        this.drawChart(); // 필터링된 데이터로 차트를 그립니다.
      },
      drawChart() {
        // 기존 차트가 있으면 파괴
        if (this.chart) {
          this.chart.destroy();
        }
  
        const labels = [];
        const roleUserData = [];
        const roleDetectiveData = [];
  
        // 날짜별로 데이터를 처리
        this.filteredData.forEach(item => {
          const date = item.createdAt.split(' ')[0]; // 날짜 부분만 추출
          const role = item.role;
          const count = item.count;
  
          // 날짜가 labels에 없으면 추가
          if (!labels.includes(date)) {
            labels.push(date);
            roleUserData.push(0); // 기본값 설정
            roleDetectiveData.push(0); // 기본값 설정
          }
  
          const index = labels.indexOf(date);
          if (role === 'ROLE_USER') {
            roleUserData[index] += count; // 기존 값에 누적
          } else if (role === 'ROLE_DETECTIVE') {
            roleDetectiveData[index] += count; // 기존 값에 누적
          }
        });
  
        // 차트 그리기
        const ctx = document.getElementById('roleChart').getContext('2d');
        this.chart = new Chart(ctx, {
          type: 'line', // 선형 그래프
          data: {
            labels: labels,
            datasets: [
              {
                label: 'ROLE_USER',
                data: roleUserData,
                borderColor: 'blue',
                fill: false,
              },
              {
                label: 'ROLE_DETECTIVE',
                data: roleDetectiveData,
                borderColor: 'red',
                fill: false,
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Count'
                }
              }
            }
          }
        });
      }
    }
  };
  </script>
  
  <style>
  canvas {
    max-width: 100%; /* 최대 너비를 800px로 설정 */
    height: 400px; /* 높이를 400px로 설정 */
    margin: 20px auto; /* 중앙 정렬 및 위쪽 여백 */
  }
  </style>
  