import { createApp } from 'vue';
import App from './App.vue';
import router from './router/route'; // 라우터 import
import store from './store/index';

// Vue 애플리케이션 인스턴스 생성
const app = createApp(App);

// Vue 애플리케이션에 라우터 추가
app.use(router);
app.use(store);
// 애플리케이션을 DOM 요소에 마운트
app.mount('#app');
