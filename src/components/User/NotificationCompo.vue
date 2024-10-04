<template>
  <div class="notification-container">
    <header class="notification-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>알림</h2>
      <span class="header-span"></span>
    </header>

    <div class="notification-contain">
      <div v-for="(notification, index) in notificationList" :key="index">
        <div
          @click="this.$router.push(notification.url)"
          class="notification-list"
        >
          <div class="title">{{ notification.title }}</div>
          <div class="time">✔️ {{ timeconvert(notification.notifyAt) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      notificationList: [],
    };
  },
  computed: {
    roles() {
      return this.$store.getters.getRoles; // Vuex에서 getRoles를 가져옴
    },
    ...mapGetters(["getId"]),
  },
  created() {
    this.loadNotification();
  },
  methods: {
    async loadNotification() {
      try {
        const response = await axios.get("/api/notification/list", {
          params: { userId: this.getId },
        });
        this.notificationList = response.data;
        this.notificationList.sort(function (a, b) {
          return -(new Date(a.notifyAt) - new Date(b.notifyAt));
        });
        console.log(this.notificationList);
      } catch (error) {
        return;
      }
    },
    goBack() {
      if (this.$route.path.startsWith("/detective")) {
        // 현재 경로가 '/detective'로 시작하면 브라우저 히스토리에서 뒤로 가기
        this.$router.go(-1);
      } else {
        this.$router.push("/mypage");
      }
    },
    timeconvert(time) {
      const converttime = new Date(time);
      const year = converttime.getFullYear();
      const month = String(converttime.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const day = String(converttime.getDate()).padStart(2, "0");
      const hour = String(converttime.getHours()).padStart(2, "0");
      const minute = String(converttime.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
  },
};
</script>

<style scoped>
.notification-container {
  font-family: Arial, sans-serif;
}

.notification-header {
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

.notification-contain {
  margin: 25px 20px;
}

.notification-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #8080804d;
  border-radius: 20px;
  margin: 10px 10px 20px 10px;
  padding: 18px 15px;
}

.notification-list:hover {
  background-color: rgba(128, 128, 128, 0.121);
  cursor: pointer;
}

.title {
  width: 70%;
  font-size: 14px;
  line-height: 25px;
}

.time {
  font-size: 13px;
  color: #808080b5;
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
