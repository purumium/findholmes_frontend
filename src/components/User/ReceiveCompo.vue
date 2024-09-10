<template>
  <div>
    <button @click="sendNotification">알림 보내기</button>
    <div v-for="(msg, index) in messages" :key="index">{{ msg }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      messages: [],
      eventSource: null,
      assignedRequests: [],
    };
  },
  created() {
    this.getAssignedRequests();
  },
  mounted() {
    this.startSse();
  },
  methods: {
    startSse() {
      this.eventSource = new EventSource("/api/test2/sse");
      this.eventSource.onmessage = (event) => {
        this.messages.push(event.data);
      };
    },
    sendNotification() {
      fetch("/api/test2/notify", {
        method: "POST",
      });
    },
    async getAllSpecialties() {
      try {
        const response = await axios.get("api/speciality");
        this.specialities = response.data;
      } catch (error) {
        this.specialities = [];
      }
    },
    async getAssignedRequests() {
      try {
        const response = await axios.get("api/estimate");
        this.assignedRequests = response.data;
      } catch (error) {
        this.assignedRequests = [];
      }
    },
  },
  beforeUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  },
};
</script>
