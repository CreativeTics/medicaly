import { RouteRecordRaw } from "vue-router";

import { authRoutes } from "@features/auth";

export const routes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "Home",
    component: () => import("@/app/features/home/views/Home.vue"),
    meta: {
      auth: true,
      layout: "home",
    },
  },
  ...authRoutes,
];
