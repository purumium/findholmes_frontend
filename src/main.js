import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/route"; // 라우터 import
import store from "./store/index";

// FontAwesome 라이브러리 관련 임포트
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// 사용할 Solid 아이콘 임포트
import {
  faHome,
  faPencilAlt,
  faSearch,
  faUser,
  faEnvelope,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
  faBell,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

// 사용할 아이콘들을 라이브러리에 추가
library.add(
  faHome,
  faPencilAlt,
  faSearch,
  faUser,
  faEnvelope,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
  faBell,
  faCommentDots
);

// Vue 애플리케이션 인스턴스 생성
const app = createApp(App);

// FontAwesomeIcon 컴포넌트를 전역 컴포넌트로 등록
app.component("font-awesome-icon", FontAwesomeIcon);


// Vue 애플리케이션에 라우터 추가
app.use(router);
app.use(store);

// 애플리케이션을 DOM 요소에 마운트
app.mount("#app");

