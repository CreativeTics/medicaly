import { RouteRecordRaw } from "vue-router";

import { authRoutes } from "@features/auth";
import { employeesRoutes } from "@features/employees";
import { positionsRoutes } from "@features/positions";
import { laboratoriesRoutes } from "@features/laboratories";

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
  ...employeesRoutes,
  ...positionsRoutes,
  ...laboratoriesRoutes,
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/app/features/not-found/views/NotFound.vue"),
    meta: {
      layout: "empty",
    },
  },
];
