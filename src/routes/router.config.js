import asyncComponent from "@/utils/asyncComponent";

const routers = [
  {
    path: "/test",
    component: asyncComponent(() => import("@/views/test")),
  },
  {
    path: "/icon",
    component: asyncComponent(() => import("@/views/icon")),
  },
  {
    path: "./page",
    redirect: true,
    component: asyncComponent(() => import("@/views/layout")),
    routers: [
      {
        path: "/page/match_tag",
        component: asyncComponent(() => import("@/views/match_tag")),
        exact: true,
        redirect: true,
        meta: { name: "匹配标签" },
      },
      {
        path: "/page/manual_tag",
        component: asyncComponent(() => import("@/views/manual_tag")),
        exact: true,
        redirect: true,
        meta: { name: "手动标签" },
      },
    ],
  },
];

export default routers;
