import Login from "./auth/views/Login.vue";
import RolesList from "./roles/views/List.vue";
import RolesCreate from "./roles/views/CreateEdit.vue";

export const authRoutes = [
  {
    path: "/",
    name: "auth.login",
    component: Login,
    meta: {
      auth: false,
      layout: "login",
    },
  },
  {
    path: "/roles",
    name: "roles.list",
    component: RolesList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/roles/create",
    name: "roles.create",
    component: RolesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/roles/edit/:id",
    name: "roles.edit",
    component: RolesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
