import Login from "./auth/views/Login.vue";
import RolesList from "./roles/views/List.vue";

export const authRoutes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: {
      auth: false,
      layout: "login",
    },
  },
  {
    path: "/roles",
    name: "RolesList",
    component: RolesList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
