import Cie10List from "./views/List.vue";
import Cie10Create from "./views/CreateEdit.vue";

export const cie10Routes = [
  {
    path: "/cie10",
    name: "cie10.list",
    component: Cie10List,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/cie10/create",
    name: "cie10.create",
    component: Cie10Create,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/cie10/edit/:id",
    name: "cie10.edit",
    component: Cie10Create,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
