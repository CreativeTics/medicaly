import SubsidiariesList from "./views/List.vue";
import SubsidiariesCreate from "./views/CreateEdit.vue";

export const subsidiariesRoutes = [
  {
    path: "/subsidiaries",
    name: "subsidiaries.list",
    component: SubsidiariesList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/subsidiaries/create",
    name: "subsidiaries.create",
    component: SubsidiariesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/subsidiaries/edit/:id",
    name: "subsidiaries.edit",
    component: SubsidiariesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
