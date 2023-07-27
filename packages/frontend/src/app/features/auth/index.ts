import Login from "./views/Login.vue";

export const authRoutes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      auth: false,
      layout: "login",
    },
  },
];
