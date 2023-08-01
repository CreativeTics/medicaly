import { RouteRecordRaw } from "vue-router";

import { authRoutes } from "@features/auth";
import { employeesRoutes } from "@features/employees";
import { positionsRoutes } from "@features/positions";
import { laboratoriesRoutes } from "@features/laboratories";
import { countriesRoutes } from "@features/countries";
import { citiesRoutes } from "@features/cities";
import { identificationTypesRoutes } from "@features/identification-types";
import { entitiesRoutes } from "@features/entities";
import { restrictionsRoutes } from "@features/restrictions";

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
  ...countriesRoutes,
  ...citiesRoutes,
  ...identificationTypesRoutes,
  ...entitiesRoutes,
  ...restrictionsRoutes,

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/app/features/not-found/views/NotFound.vue"),
    meta: {
      layout: "empty",
    },
  },
];
