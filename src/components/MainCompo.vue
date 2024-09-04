<template>
  <div>
    <h1>메인페이지</h1>
    <h3>스프링이랑 연결확인</h3>
    <button @click="test">{{ value || '버튼' }}</button></div>
  
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return {
            value: ''
        }
    },
    methods: {
        async test() {
            try {
                // Spring Boot 서버의 URL을 적절히 설정합니다.
                // const response = await axios.get('http://localhost:8080/api/test');
                const response = await axios.get('/api/test/test2');
                // 서버로부터 받은 데이터를 value에 저장합니다.
                // console.log(response2)
                this.value = response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
                // 에러가 발생하면 로그를 남기고, 필요한 경우 기본값을 설정합니다.
                this.value = '오류 발생';
            }
        }
    }
}
</script>

<style>

</style>