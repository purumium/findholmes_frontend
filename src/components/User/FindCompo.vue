<template>
  <div>
    탐정찾기 페이지
    <button @click="fetchData">버튼</button>
    <button @click="fetchData2">버튼2</button>
  </div>
</template>

<script>
import axios from 'axios';



export default {
  methods: {
    fetchData() {
      // Axios 헤더에 토큰 설정
      const token = localStorage.getItem('token');

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      console.log(token)
      console.log("asd")
      // API 요청 예시
      axios.get('/api/test/test2')
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching protected resource', error);
        });
    },
    fetchData2() {
      // Axios 헤더에 토큰 설정
      // const token = localStorage.getItem('token');

      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // console.log(token)
      console.log("asd")
      // API 요청 예시
      axios.get('/api/test2/test2')
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching protected resource', error);
        });
    }
  }
}
</script>

<style>
</style>
