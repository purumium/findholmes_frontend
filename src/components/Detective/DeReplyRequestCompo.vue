<template>
  <div>
    <h1>견적 보내기</h1>
    {{ this.requestId }}
    <input v-model="price" />
    <textarea v-model="description"></textarea>
    <button @click="replyRequest">보내기</button>
    <button @click="click">버튼</button>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  props: ["requestId"],
  data() {
    return {
      description: "",
      price: 0,
      request: [],
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  created() {
    this.getRequestDetail();
  },
  methods: {
    async getRequestDetail() {
      console.log("실행시도", this.requestId);
      try {
        const response = await axios.get("/receive/detail", {
          baseURL: "http://localhost:8080/",
          params: { requestId: this.requestId },
        });
        this.request = response.data;
        console.log(this.request);
      } catch (error) {
        this.assignedRequests = [];
      }
    },
    async replyRequest() {
      try {
        await axios.post("/api/reply", {
          requestId: this.requestId,
          clientId: this.request.clientId,
          price: this.price,
          email: this.getUser,
          description: this.description,
        });
      } catch (error) {
        return;
      }
    },
    click() {
      console.log(
        "requestId:" +
          this.requestId +
          " / " +
          "clientId:" +
          this.request.clientId +
          " / " +
          "price:" +
          this.price +
          " / " +
          "detectiveId:" +
          this.request.detectiveId +
          " / " +
          "description:" +
          this.description
      );
    },
  },
};
</script>

<style></style>
