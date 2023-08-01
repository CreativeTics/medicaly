import RestrictionsList from "./views/List.vue";
import RestrictionsCreate from "./views/CreateEdit.vue";

export const restrictionsRoutes = [
  {
    path: "/restrictions",
    name: "restrictions.list",
    component: RestrictionsList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/restrictions/create",
    name: "restrictions.create",
    component: RestrictionsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/restrictions/edit/:id",
    name: "restrictions.edit",
    component: RestrictionsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
