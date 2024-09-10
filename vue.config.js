const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8000, // 개발 서버 포트 설정
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드 서버의 URL
        changeOrigin: true,
        pathRewrite: { "^/api": "" }, // '/api'를 제거하여 실제 API 경로와 일치시킵니다.
      },
      // 웹소켓 경로를 프록시 설정
      "/ws": {
        target: "ws://localhost:8080", // Spring Boot 서버의 웹소켓 주소
        ws: true, // 웹소켓 프록시 활성화
        changeOrigin: true,
      },
    },
  },
});
