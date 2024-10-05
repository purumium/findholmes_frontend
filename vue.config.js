const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8000, // 개발 서버 포트 설정
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드 서버의 URL
        // target: "http://13.209.252.43",
        ws: false,
        changeOrigin: true,
        pathRewrite: { "^/api": "" }, // '/api'를 제거하여 실제 API 경로와 일치시킵니다.
      },
    },
  },
});
