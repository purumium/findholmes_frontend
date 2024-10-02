import { createRouter, createWebHistory } from "vue-router";
import MainCompo from "@/components/MainCompo.vue";
import MiddleCompo from "@/components/MiddleCompo.vue";
import LoginCompo from "@/components/Member/LoginCompo.vue";
import RegisterCompo from "@/components/Member/RegisterCompo.vue";
import FindCompo from "@/components/User/FindCompo.vue";
import RequestCompo from "@/components/User/RequestCompo.vue";
import ReceiveCompo from "@/components/User/ReceiveCompo.vue";
import LogoutCompo from "@/components/Member/LogoutCompo.vue";
import PaymentCompo from "@/components/User/PaymentCompo.vue";
import PaymentListCompo from "@/components/User/PaymentListCompo.vue";
import MyinfoCompo from "@/components/User/MyInfoCompo.vue";
import ChatCompo from "@/components/User/ChatCompo.vue";
import NotificationCompo from "@/components/User/NotificationCompo.vue";
import PaymentResultCompo from "@/components/User/PaymentResultCompo.vue";
import DeMainCompo from "@/components/Detective/DeMainCompo.vue";
import DeMiddleCompo from "@/components/Detective/DeMiddleCompo.vue";
import DeEstimateListCompo from "@/components/Detective/DeEstimateListCompo.vue";
import DeReceivedListCompo from "@/components/Detective/DeReceivedListCompo.vue";
import DeMypageCompo from "@/components/Detective/DeMypageCompo.vue";
import DeMyInfoCompo from "@/components/Detective/DeMyInfoCompo.vue";
import DeChatCompo from "@/components/Detective/DeChatCompo.vue";
import ChatRoomCompo from "@/components/User/ChatRoomCompo.vue";
import DetailReceiveCompo from "@/components/User/DetailReceiveCompo.vue";
import DeChatRoomCompo from "@/components/Detective/DeChatRoomCompo.vue";
import DeReceivedDetailCompo from "@/components/Detective/DeReceivedDetailCompo.vue";
import DeEstimateCreateCompo from "@/components/Detective/DeEstimateCreateCompo.vue";
import DetailRequestCompo from "@/components/User/DetailRequestCompo.vue";
import DetectiveListCompo from "@/components/User/DetectiveListCompo.vue";
import DeRegisterCompo from "@/components/Detective/DeRegisterCompo.vue";
import ReviewListCompo from "@/components/User/ReviewListCompo.vue";
import PointHistoryCompo from "@/components/User/PointHistoryCompo.vue";
import InqueryCompo from "@/components/User/InqueryCompo.vue";
import DeleteAccountCompo from "@/components/User/DeleteAccountCompo.vue";
import PrivacyPolicyCompo from "@/components/User/PrivacyPolicyCompo.vue";
import MypageCompo from "@/components/User/MypageCompo.vue";
import DeEstimateCompo from "@/components/Detective/DeEstimateCompo.vue";
import AdMainCompo from "@/components/Admin/AdMainCompo.vue";
import AdApprovalCompo from "@/components/Admin/AdApprovalCompo.vue";
import AdInqueryCompo from "@/components/Admin/AdInqueryCompo.vue";
import DetectiveDetailProfileCompo from "@/components/User/DetectiveDetailProfileCompo.vue";
import InqueryCreateCompo from "@/components/User/InqueryCreateCompo.vue";
import InqueryListCompo from "@/components/User/InqueryListCompo.vue";
import RequestDirectCompo from "@/components/User/RequestDirectCompo.vue";
import AdInqueryDetailCompo from "@/components/Admin/AdInqueryDetailCompo.vue";
import AdChartCompo from "@/components/Admin/AdChartCompo.vue";
import InqueryDetailCompo from "@/components/User/InqueryDetailCompo.vue";

const routes = [
  {
    path: "/admin",
    component: MiddleCompo,
    children: [
      {
        path: "main",
        component: AdMainCompo,
        alias: [""],
      },
      {
        path: "approval",
        component: AdApprovalCompo,
      },
      {
        path: "inquery",
        component: AdInqueryCompo,
      },
      {
        path: "inquery/:inqueryid",
        name: "InqueryDetail",
        component: AdInqueryDetailCompo,
        props: true, // props로 route의 파라미터 전달
      },
      {
        path: "chart",
        component: AdChartCompo,
      },
    ],
  },
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
        component: NotificationCompo,
      },
      {
        path: "chat",
        component: DeChatCompo,
      },
      {
        path: "chatroom",
        name: "DetectiveChatRoom",
        component: DeChatRoomCompo,
        props: (route) => ({
          chatRoomId: route.params.chatRoomId,
        }),
      },
      {
        path: "estimatelist",
        component: DeEstimateListCompo,
      },
      {
        path: "estimate/:requestId",
        component: DeEstimateCreateCompo,
        props: true,
      },
      {
        path: "view/estimate/:requestId",
        component: DeEstimateCompo,
        props: true,
      },
      {
        path: "requestlist",
        component: DeReceivedListCompo,
      },

      {
        path: "received/:requestId",
        component: DeReceivedDetailCompo,
        props: true,
      },
      {
        path: "mypage",
        component: DeMypageCompo,
      },
      {
        path: "register",
        component: DeRegisterCompo,
      },
      {
        path: "myinfo",
        component: DeMyInfoCompo,
      },
      {
        path: "point",
        component: PointHistoryCompo, // 포인트 사용내역
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
      {
        path: "inquery",
        component: InqueryCompo, // 문의하기
        children: [
          {
            path: "",
            component: InqueryCreateCompo,
          },
          {
            path: "list",
            component: InqueryListCompo,
          },
          {
            path: "list/:inqueryid",
            name: "DetectiveInqueryDetail",
            component: InqueryDetailCompo,
            props: true, // props로 route의 파라미터 전달
          },
        ],
      },
      {
        path: "deleteaccount",
        component: DeleteAccountCompo, // 회원탈퇴
      },
      {
        path: "privacypolicy",
        component: PrivacyPolicyCompo, // 개인정보처리방침
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
        path: "chatroom/:chatRoomId", // URL 경로에 chatRoomId를 파라미터로 받음
        name: "ChatRoom",
        component: ChatRoomCompo, // ChatRoomCompo는 ChatRoom 컴포넌트로 대체
        props: (route) => ({
          chatRoomId: route.params.chatRoomId,
        }),
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
        path: "detectivelist",
        component: DetectiveListCompo,
      },
      {
        path: "profile/:detectiveId",
        component: DetectiveDetailProfileCompo,
        name: "Profile",
        props: true,
      },
      {
        path: "request",
        component: RequestCompo,
      },
      {
        path: "request/:detectiveId",
        component: RequestDirectCompo,
        props: true,
      },
      {
        path: "detailrequest/:requestId",
        component: DetailRequestCompo,
        props: true,
      },
      {
        path: "receive",
        component: ReceiveCompo,
      },
      {
        path: "estimatelist/:requestId",
        component: DetailReceiveCompo,
        props: true,
      },
      {
        path: "mypage",
        component: MypageCompo, // 나의페이지
      },
      {
        path: "myinfo",
        component: MyinfoCompo, // 프로필 편집
      },
      {
        path: "reviewlist",
        component: ReviewListCompo, // 리뷰 내역
      },
      {
        path: "point",
        component: PointHistoryCompo, // 포인트 사용내역
      },
      {
        path: "payment",
        component: PaymentCompo, // 결제하기
      },
      {
        path: "paymentlist",
        component: PaymentListCompo, // 결제 내역
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
      {
        path: "inquery",
        component: InqueryCompo, // 문의하기
        children: [
          {
            path: "",
            component: InqueryCreateCompo,
          },
          {
            path: "list",
            component: InqueryListCompo,
          },
          {
            path: "list/:inqueryid",
            name: "UserInqueryDetail",
            component: InqueryDetailCompo,
            props: true, // props로 route의 파라미터 전달
          },
        ],
      },
      {
        path: "deleteaccount",
        component: DeleteAccountCompo, // 회원탈퇴
      },
      {
        path: "privacypolicy",
        component: PrivacyPolicyCompo, // 개인정보처리방침
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
