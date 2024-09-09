<template>
  <div>
    <button @click="sendNotification">알림 보내기</button>
    <div v-for="(msg, index) in messages" :key="index">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      eventSource: null,
    };
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
  },
  beforeUnmount() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  },
};
</script>
