<template>
  <div class="delete-container">
    <header class="delete-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>회원 탈퇴</h2>
    </header>

    <div class="delete-contain">
      <div class="reason">
        <h3>탈퇴하는 이유가 무엇인가요?</h3>
        <div class="reason-list">
          <div
            class="reason-item"
            v-for="(reason, index) in filteredReasons"
            :key="index"
            @click="selectReason(reason, index)"
            :class="{ selected: selectedReason === reason }"
          >
            <p>{{ reason }}</p>
            <span>&gt;</span>
          </div>
        </div>
      </div>

      <div class="confirmation">
        <h3>탈퇴하기 전에 확인해주세요</h3>
        <p>
          찾아줘홈즈에서 관리했던 <span>{{ userName }}</span
          >님의 모든 개인정보를 다시 볼 수 없어요.
        </p>
        <p>결제한 포인트 금액 및 관련 내역들이 모두 사라져요.</p>
      </div>

      <div class="button-group">
        <button
          :disabled="!selectedReason"
          @click="handleButtonClick"
          class="btn-withdraw"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import { useStore } from "vuex";

export default {
  data() {
    return {
      userName: "선선해", // 사용자 이름 예시
      userReasons: [
        "쓰지 않는 앱이에요",
        "홈즈 추천 기능이 유용하지 않아요",
        "오류가 생겨서 쓸 수 없어요",
        "사생활 및 보안이 걱정돼요",
        "앱 사용법을 모르겠어요",
        "기타",
      ],
      detectiveReasons: [
        "의뢰가 충분히 들어오지 않아요",
        "탐정 활동에 제약이 많아요",
        "수수료가 너무 높아요",
        "지원이 부족하다고 느껴요",
        "앱 사용이 불편해요",
        "기타",
      ],
      selectedReason: null,
      index: null,
    };
  },
  computed: {
    roles() {
      return this.$store.getters.getRoles; // Vuex에서 getRoles를 가져옴
    },
    filteredReasons() {
      console.log("roles : " + this.roles);
      return this.roles === "ROLE_DETECTIVE"
        ? this.detectiveReasons
        : this.userReasons;
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
    selectReason(reason,index) {
      this.selectedReason = reason;
      this.index = index;
    },
    handleButtonClick() {
      const confirmation = window.confirm(
        `정말 탈퇴하시겠습니까? \n[이유] ${this.selectedReason}`
      );
      if (confirmation) {
        this.handleWithdelete();
      } else {
        alert("탈퇴가 취소되었습니다.");
      }
    },
    async handleWithdelete() {
      // const store = useStore();
      console.log(this.selectedReason)
      console.log(this.index)

      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 탈퇴정보를
      const response = await axios.post("http://3.35.185.10:8080/member/delete?index=${this.index}`);

      console.log(response)
      // await store.dispatch("logout"); // Vuex의 logout 액션 호출
      alert(`회원 탈퇴가 완료되었습니다.`);

      // 탈퇴 후 login 페이지로 이동
      // this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.delete-container {
  font-family: Arial, sans-serif;
}

.delete-header {
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

.delete-contain {
  margin: 30px 20px;
}

h3 {
  font-size: 18px;
  font-weight: bold;
  margin: 25px 0 20px 0;
}

.reason-list {
  border-top: 1px solid #e0e0e0;
}

.reason-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.reason-item p {
  margin: 0;
}

.reason-item.selected {
  font-weight: 600;
  color: #ecb9009c;
}

.confirmation {
  margin-top: 40px;
  font-size: 14px;
  color: #281e1e;
}

.button-group {
  margin-top: 45px;
  text-align: center;
}

.btn-withdraw {
  padding: 12px 20px;
  width: 100%;
  border: none;
  border-radius: 5px;
  background-color: #ffdf3e9c;
  color: #050303;
  font-weight: 600;
  font-size: 14px;
}

.btn-withdraw:disabled {
  background-color: #c0bba566;
  cursor: not-allowed;
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
