import { RouteRecordRaw } from "vue-router";

import { authRoutes } from "@features/auth";
import { employeesRoutes } from "@features/employees";
import { positionsRoutes } from "@features/positions";
import { laboratoriesRoutes } from "@features/laboratories";
import { countriesRoutes } from "@features/countries";
import { departmentsRoutes } from "@features/departments";
import { citiesRoutes } from "@features/cities";
import { identificationTypesRoutes } from "@features/identification-types";
import { entitiesRoutes } from "@features/entities";
import { restrictionsRoutes } from "@features/restrictions";
import { recommendationsRoutes } from "@features/recommendations";
import { cie10Routes } from "@features/cie10";
import { examsRoutes } from "@features/exams";
import { contractsRoutes } from "@features/contracts";
import { subsidiariesRoutes } from "@features/subsidiaries";

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
  ...departmentsRoutes,
  ...citiesRoutes,
  ...identificationTypesRoutes,
  ...entitiesRoutes,
  ...restrictionsRoutes,
  ...recommendationsRoutes,
  ...cie10Routes,
  ...examsRoutes,
  ...contractsRoutes,
  ...subsidiariesRoutes,
];
