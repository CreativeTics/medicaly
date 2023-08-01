import LaboratoriesList from "./views/List.vue";
import LaboratoriesCreate from "./views/CreateEdit.vue";

export const laboratoriesRoutes = [
  {
    path: "/laboratories",
    name: "laboratories.list",
    component: LaboratoriesList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/laboratories/create",
    name: "laboratories.create",
    component: LaboratoriesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/laboratories/edit/:id",
    name: "laboratories.edit",
    component: LaboratoriesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
