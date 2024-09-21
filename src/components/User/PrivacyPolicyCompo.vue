<template>
  <div class="review-container">
    <header class="review-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>개인정보처리방침</h2>
    </header>

    <div class="review-contain">
      <section>
        <h2>1. 수집하는 개인정보 항목 및 수집방법</h2>
        <p>
          찾아줘홈즈는 서비스 회원가입 및 이용과정에서 아래와 같은 개인정보를
          수집 및 이용하고 있습니다.
        </p>
        <ul>
          <li>이름</li>
          <li>비밀번호</li>
          <li>이메일</li>
          <li>휴대폰번호</li>
          <li>자격증 관련 정보 (자격명, 발급기관, 취득일 등)</li>
          <li>프로필 사진</li>
          <li>사무실 주소</li>
        </ul>
      </section>

      <section>
        <h2>2. 개인정보의 수집 및 이용 목적</h2>
        <p>수집된 개인정보는 다음과 같은 목적을 위해 이용됩니다:</p>
        <ul>
          <li>서비스 제공 및 콘텐츠 제공, 맞춤 서비스 제공</li>
          <li>전문가 검색 및 추천 기능 제공</li>
          <li>회원제 서비스 제공 및 개인식별</li>
          <li>약관 위반 회원에 대한 제재, 불만 처리 및 고지사항 전달</li>
          <li>회원 탈퇴 의사 확인</li>
          <li>신규 서비스 개발 및 마케팅·광고 활용</li>
        </ul>
      </section>

      <section>
        <h2>3. 개인정보의 보유 및 이용 기간</h2>
        <p>
          수집된 개인정보는 목적 달성 후 지체 없이 삭제되며, 단 아래의 정보를
          이용자 동의 하에 보관합니다:
        </p>
        <ul>
          <li>
            보유 정보: 이메일(아이디), 비밀번호, 이름, 생년월일, 성별, 전문가
            자격 정보, 소속
          </li>
          <li>보존 이유: 재가입 방지 및 부정 이용 방지</li>
          <li>보존 기간: 탈퇴 후 6개월간 보관</li>
        </ul>
        <p>
          회원가입일로부터 서비스 제공 기간 동안 개인정보를 보유 및 이용합니다.
          법령에 의해 보존이 필요한 경우 해당 기간 동안 거래 내역 및 기본 정보를
          보유하며, 보유 목적 외의 용도로는 이용되지 않습니다.
        </p>
      </section>

      <section>
        <h2>4. 법령에 의한 보존</h2>
        <ul>
          <li>계약 또는 청약철회 기록: 5년</li>
          <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
          <li>소비자 불만 또는 분쟁 처리에 관한 기록: 3년</li>
          <li>부정 이용에 관한 기록: 5년</li>
          <li>웹사이트 방문기록: 1년</li>
        </ul>
      </section>

      <section>
        <h2>5. 개인정보 민원 서비스</h2>
        <p>개인정보 침해 관련 상담은 아래 기관에서 가능합니다:</p>
        <ul>
          <li>
            개인정보침해신고센터: (국번없이) 118 (<a
              href="http://privacy.kisa.or.kr"
              target="_blank"
              >privacy.kisa.or.kr</a
            >)
          </li>
          <li>
            개인정보 분쟁조정위원회: 1833-6972 (<a
              href="http://www.kopico.go.kr"
              target="_blank"
              >www.kopico.go.kr</a
            >)
          </li>
          <li>
            대검찰청 사이버수사과: (국번없이) 1301,
            <a href="mailto:cid@spo.go.kr">cid@spo.go.kr</a> (<a
              href="http://www.spo.go.kr"
              target="_blank"
              >www.spo.go.kr</a
            >)
          </li>
          <li>
            경찰청 사이버안전국: (국번없이) 182 (<a
              href="http://cyberbureau.police.go.kr"
              target="_blank"
              >cyberbureau.police.go.kr</a
            >)
          </li>
        </ul>
      </section>

      <section>
        <h2>부칙</h2>
        <p>본 약관은 2024년 8월 30일부터 시행합니다.</p>
        <p>
          변경사항: 개인정보처리방침 개정(2024-08-30) - 개인정보책임자 정보 변경
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    roles() {
      return this.$store.getters.getRoles; // Vuex에서 getRoles를 가져옴
    },
  },
  methods: {
    goBack() {
      if (this.roles === "ROLE_DETECTIVE") {
        this.$router.push("/detective/mypage");
      } else {
        this.$router.push("/mypage");
      }
    },
  },
};
</script>

<style scoped>
.review-header {
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

.review-contain {
  margin: 25px 20px;
}

.review-contain {
  max-width: 900px;
  padding: 5px 21px;
  background-color: #f9f9f900;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
  color: #333;
  line-height: 23px;
}

h1,
h2 {
  color: #222;
  margin-bottom: 10px;
}

ul {
  margin: 15px 0;
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
}

a {
  color: #0073e6;
  text-decoration: none;
}

@media screen and (max-width: 480px) {
  h2 {
    font-size: 14px;
  }

  .back-button {
    font-size: 15px;
    margin-left: 0px;
    padding: 8px 15px;
    background: none;
    border: none;
    cursor: pointer;
  }
}
</style>
