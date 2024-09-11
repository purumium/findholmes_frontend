<template>
  <div>
    <h2>견적 상세보기</h2>
    <h1>{{ requestId }}</h1>
    <button @click="getUserInfo">클릭</button>
    <button @click="moveToReply">이동</button>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  props: ["requestId"],
  computed: {
    ...mapGetters(["getUser"]),
  },
  data() {
    return {
      request: [],
    };
  },
  created() {
    this.getRequestDetail();
  },
  methods: {
    async getRequestDetail() {
      console.log("실행시도", this.requestId);
      try {
        const response = await axios.get(`/receive/detail/${this.requestId}`, {
          baseURL: "http://localhost:8080/",
          params: { email: this.getUser },
        });
        this.request = response.data;
        console.log(this.request);
      } catch (error) {
        this.assignedRequests = [];
      }
    },
    getUserInfo() {
      console.log(this.getUser);
    },
    moveToReply() {
      this.$router.push(`/detective/reply/${this.request.requestId}`);
    },
  },
};
</script>

<style></style>
