<template>
  <div class="main-container">
    <section class="hero">
      <div class="header-section">
        <img src="/images/maintitle.jpg" />
      </div>
    </section>

    <section class="services">
      <div class="service-cards">
        <div class="service-card">
          <img src="@/assets/main/service1.png" />
          <div>의뢰인의 요청이 오면</div>
          <div>견적서를 작성합니다</div>
        </div>
        <div class="service-card">
          <img src="@/assets/main/service2.png" />
          <div>의뢰인이 견적서를 보고</div>
          <div>탐정에게 의뢰를 맡깁니다</div>
        </div>
        <div class="service-card">
          <img src="@/assets/main/service3.png" />
          <div>찾아줘 홈즈를 통해</div>
          <div>의뢰인과 대화해 보세요</div>
        </div>
      </div>
    </section>

    <section class="last">
      <div>
        <h4>스프링이랑 연결확인</h4>
        <button @click="test">{{ value || "버튼" }}</button>
        <button @click="test2">
          {{ value || "토큰보내서 유저 가져오기" }}
        </button>
        <div>
          <h4>스토어 출력</h4>
          <p>{{ user || "로그인 정보 없음" }}</p>
          <p>{{ isAuthenticated ? "인증됨" : "인증되지 않음" }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed } from "vue";
import { useStore } from "vuex"; // Vuex 스토어 사용

export default {
  setup() {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const store = useStore(); // Vuex 스토어 인스턴스 가져오기
    const value = ref(""); // 버튼 클릭 시 서버 응답 데이터를 저장할 변수
    const user = computed(() => store.state); // Vuex 스토어에서 user 데이터 가져오기
    const isAuthenticated = computed(() => store.getters.isAuthenticated); // 인증 상태 가져오기

    const test = async () => {
      try {
        const response = await axios.get("/api/test/test2");
        value.value = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        value.value = "오류 발생";
      }
    };

    const test2 = async () => {
      try {
        const response = await axios.get("/api/test/getdetail");
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        value.value = "오류 발생";
      }
    };

    return {
      value,
      test,
      user,
      isAuthenticated,
      test2,
    };
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
}

.header-section img {
  width: 100%;
}

.services {
  text-align: center;
  padding: 40px 0;
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
  /* font-weight: 600; */
  margin: 5px 0;
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
