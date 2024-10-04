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
          <div>필요한 서비스를 선택하고</div>
          <div>의뢰서를 작성하세요</div>
        </div>
        <div class="service-card">
          <img src="@/assets/main/service2.png" />
          <div>무료로 탐정에게</div>
          <div>답변서를 받아볼 수 있어요</div>
        </div>
        <div class="service-card">
          <img src="@/assets/main/service3.png" />
          <div>딱 맞는 탐정을 추천받고</div>
          <div>이야기를 나눠보세요</div>
        </div>
      </div>
    </section>

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
import { jwtDecode } from "jwt-decode";
import axios from "axios"; // Axios 사용
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      profileImage: "",
      errorMessage: "",
    };
  },
  created() {
    this.handleOAuth2LoginSuccess();
  },
  methods: {
    handleOAuth2LoginSuccess() {
      // URL에서 쿼리 파라미터로 전달된 토큰 추출
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const store = useStore();
      const router = useRouter();

      if (token) {
        try {
          const decoded = jwtDecode(token);

          console.log("JWT Token: ", token);
          console.log("Decoded: ", decoded);

          // Vuex 스토어에 토큰 및 사용자 정보 저장
          store.dispatch("login", {
            token,
            user: decoded.sub,
            roles: decoded.roles, // 역할 저장
          });

          // 로컬 스토리지에 토큰 저장 (필요한 경우)
          localStorage.setItem("token", token);

          // 역할에 따른 화면 이동 (탐정화면, 의뢰인 화면, 관리자 화면)
          if (decoded.roles.includes("ROLE_DETECTIVE")) {
            router.push("/detective");
          } else if (decoded.roles.includes("ROLE_USER")) {
            router.push("/");
          } else if (decoded.roles.includes("ROLE_ADMIN")) {
            router.push("/admin");
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("JWT decoding failed:", error);
          this.errorMessage = "OAuth2 Login failed. Invalid token.";
        }
      } else {
        console.error("No token found in URL");
        this.errorMessage = "OAuth2 Login failed. No token received.";
      }
    },
    goBack() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      this.$router.go(-1);
    },
    async write() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.post("/api/review/write", {
          detectiveId: 1,
          rating: 5,
          content: "리뷰 테스트",
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async update() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.post("/api/review/update", {
          id: 1, //리뷰 아이디
          detectiveId: 1,
          rating: 7,
          content: "리뷰 수정 테스트",
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async get() {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const detectiveId = 1;
      try {
        const response = await axios.get(`/api/review/get/${detectiveId}`);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
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
}

.header-section img {
  width: 100%;
}

.services {
  text-align: center;
  padding: 30px 0 50px 0;
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
  font-size: 13px;
  letter-spacing: -0.5px;
  color: #190404;
  margin: 5px 0;
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
</style>
