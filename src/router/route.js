import { createRouter, createWebHistory } from "vue-router";
import MainCompo from "@/components/MainCompo.vue";
import MiddleCompo from "@/components/MiddleCompo.vue";
import LoginCompo from "@/components/Member/LoginCompo.vue";
import RegisterCompo from "@/components/Member/RegisterCompo.vue";
import FindCompo from "@/components/User/FindCompo.vue";
import RequestCompo from "@/components/User/RequestCompo.vue";
import ReceiveCompo from "@/components/User/ReceiveCompo.vue";
import LogoutCompo from "@/components/Member/LogoutCompo.vue";
import MypageCompo from "@/components/User/MypageCompo.vue";
import PaymentCompo from "@/components/User/PaymentCompo.vue";
import PaymentListCompo from "@/components/User/PaymentListCompo.vue";
import MyinfoCompo from "@/components/User/MyInfoCompo.vue";
import ChatCompo from "@/components/User/ChatCompo.vue";
import NotificationCompo from "@/components/User/NotificationCompo.vue";
import PaymentResultCompo from "@/components/User/PaymentResultCompo.vue";
import DeMainCompo from "@/components/Detective/DeMainCompo.vue";
import DeMiddleCompo from "@/components/Detective/DeMiddleCompo.vue";
import DeNotificationCompo from "@/components/Detective/DeNotificationCompo.vue";
import DeEstimateListCompo from "@/components/Detective/DeEstimateListCompo.vue";
import DeReceivedListCompo from "@/components/Detective/DeReceivedListCompo.vue";
import DeMypageCompo from "@/components/Detective/DeMypageCompo.vue";
import DeMyInfoCompo from "@/components/Detective/DeMyInfoCompo.vue";
import DePaymentCompo from "@/components/Detective/DePaymentCompo.vue";
import DePaymentListCompo from "@/components/Detective/DePaymentListCompo.vue";
import DePaymentResultCompo from "@/components/Detective/DePaymentResultCompo.vue";
import DeChatCompo from "@/components/Detective/DeChatCompo.vue";

const routes = [
  {
    path: "/detective",
    component: DeMiddleCompo,
    children: [
      {
        path: "mains",
        component: DeMainCompo,
        alias: [""],
      },
      {
        path: "notification",
        component: DeNotificationCompo,
      },
      {
        path: "chat",
        component: DeChatCompo,
      },
      {
        path: "estimate",
        component: DeEstimateListCompo,
      },
      {
        path: "received",
        component: DeReceivedListCompo,
      },
      {
        path: "mypage",
        component: DeMypageCompo,
        children: [
          {
            path: "myinfo",
            component: DeMyInfoCompo,
            alias: [""],
          },
          {
            path: "payment",
            component: DePaymentCompo,
          },
          {
            path: "paymentlist",
            component: DePaymentListCompo,
          },
          {
            path: "paymentResult",
            component: DePaymentResultCompo,
            props: (route) => ({
              merchantUid: route.query.merchantUid,
              paymentDetails: route.query.paymentDetails,
              paymentAt: route.query.paymentAt,
              price: route.query.price,
            }),
          },
        ],
      },
    ],
  },
  {
    path: "/",
    component: MiddleCompo,
    children: [
      {
        path: "main",
        component: MainCompo,
        alias: [""],
      },
      {
        path: "login",
        component: LoginCompo,
      },
      {
        path: "register",
        component: RegisterCompo,
      },
      {
        path: "chat",
        component: ChatCompo,
      },
      {
        path: "notification",
        component: NotificationCompo,
      },
      {
        path: "find",
        component: FindCompo,
      },
      {
        path: "request",
        component: RequestCompo,
      },
      {
        path: "receive",
        component: ReceiveCompo,
      },
      {
        path: "mypage",
        component: MypageCompo,
        children: [
          {
            path: "myinfo",
            component: MyinfoCompo,
            alias: [""],
          },
          {
            path: "payment",
            component: PaymentCompo,
          },
          {
            path: "paymentlist",
            component: PaymentListCompo,
          },

          {
            path: "paymentResult",
            name: "paymentResult",
            component: PaymentResultCompo,
            props: (route) => ({
              merchantUid: route.query.merchantUid,
              paymentDetails: route.query.paymentDetails,
              paymentAt: route.query.paymentAt,
              price: route.query.price,
            }),
          },
        ],
      },
      {
        path: "logout",
        component: LogoutCompo,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
