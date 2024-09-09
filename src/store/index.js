import { createStore } from "vuex";
import { jwtDecode } from "jwt-decode";
// 스토어 생성
const store = createStore({
  state: {
    token: localStorage.getItem("token") || null, // 로컬 스토리지에서 토큰을 가져옵니다.
    user: null,
    roles: null, // 사용자 역할을 저장할 배열
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.user = token ? jwtDecode(token).sub : null;
      state.roles = token ? jwtDecode(token).roles : null;
    },
    setUser(state, token) {
      state.user = token ? jwtDecode(token).sub : null;
    },
    setRole(state, token) {
      state.user = token ? jwtDecode(token).sub : null;
    },
    clearAuthData(state) {
      state.token = null;
      state.user = null;
      state.roles = null;
    },
  },
  actions: {
    login({ commit }, authData) {
      // 예를 들어, 서버에 로그인 요청을 보낸 후 응답에서 토큰을 받아 저장하는 로직
      const token = authData.token;
      // const user = authData.user;
      commit("setToken", token);
    },
    logout({ commit }) {
      commit("clearAuthData");
      localStorage.removeItem("token");
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    getUser(state) {
      return state.user;
    },
    getRoles(state) {
      return state.roles; // roles 배열 반환
    },
    hasRole: (state) => (role) => {
      return state.roles ? state.roles.includes(role) : false; // 특정 역할이 있는지 확인
    },
  },
});

export default store;
