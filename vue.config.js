const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8000, // 개발 서버 포트 설정
    proxy: {
      "/api": {
        // target: "http://52.78.25.102:8080", // 백엔드 서버의 URL
        // target: "http://13.209.252.43",
        target: "http://localhost:8080",
        ws: false,
        changeOrigin: true,
        pathRewrite: { "^/api": "" }, // '/api'를 제거하여 실제 API 경로와 일치시킵니다.
      },
      // "/ws": {
      //   target: "http://localhost:8080", // Spring Boot 서버 주소
      //   ws: true, // WebSocket을 위한 설정
      //   changeOrigin: true,
      //   secure: false, // https 사용 시 true로 변경
      //   pathRewrite: { "^/ws": "/ws" }, // 필요에 따라 경로 재작성
      //   logLevel: "debug", // 디버깅용 로그
      // },
    },
  },
});
