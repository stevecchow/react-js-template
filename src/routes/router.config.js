import asyncComponent from "@/utils/asyncComponent";
const routers = [
  {
    path: "/",
    exact: true,
    component: asyncComponent(() => import("@/views/Home")),
  },
  {
    path: "/test",
    component: asyncComponent(() => import("@/views/Test")),
  },
  // {
  //   path: "./page",
  //   redirect: true,
  //   component: asyncComponent(() => import("@/views/layout")),
  //   routes: [
  //     {
  //       path: "/page/match_tag",
  //       component: asyncComponent(() => import("@/views/match_tag")),
  //       exact: true,
  //       redirect: true,
  //       meta: { name: "匹配标签" },
  //     },
  //     {
  //       path: "/page/manual_tag",
  //       component: asyncComponent(() => import("@/views/manual_tag")),
  //       exact: true,
  //       redirect: true,
  //       meta: { name: "手动标签" },
  //     },
  //   ],
  // },
  {
    path: "*",
    component: asyncComponent(() => import("@/views/404")),
  },
];
console.log(routers);

export default routers;
