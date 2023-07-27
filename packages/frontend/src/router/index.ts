// import { useUserStore } from "@/store/user";
import {
  createRouter,
  type RouteRecordRaw,
  createWebHistory,
} from "vue-router";
import { routes } from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach(async (to) => {
//   const store = useUserStore();
//   const isAuthenticated = await store.isAuthenticated;
//   if (to.meta.auth && !isAuthenticated) return "/login";
// });

export default router;
