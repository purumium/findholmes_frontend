import { createRouter, createWebHistory } from 'vue-router';
import MainCompo from '@/components/MainCompo.vue';
import MiddleCompo from '@/components/MiddleCompo.vue';
import LoginCompo from '@/components/Member/LoginCompo.vue';
import RegisterCompo from '@/components/Member/RegisterCompo.vue';
import FindCompo from '@/components/User/FindCompo.vue';
import RequestCompo from '@/components/User/RequestCompo.vue';
import ReceiveCompo from '@/components/User/ReceiveCompo.vue';
import LogoutCompo from '@/components/Member/LogoutCompo.vue';


const routes = [
  {
    path: '/',
    component: MiddleCompo,
    children: [
      {
        path: 'main',
        component: MainCompo,
        alias: ['']
      },
      {
        path: 'login',
        component: LoginCompo
      },
      {
        path: 'register',
        component: RegisterCompo
      },
      {
        path: 'find',
        component: FindCompo
      },
      {
        path: 'request',
        component: RequestCompo
      },
      {
        path: 'receive',
        component: ReceiveCompo
      },
      {
        path: 'logout',
        component: LogoutCompo
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
