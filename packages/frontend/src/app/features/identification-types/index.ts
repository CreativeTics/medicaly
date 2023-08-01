import IdentificationTypesList from "./views/List.vue";
import IdentificationTypesCreate from "./views/CreateEdit.vue";

export const identificationTypesRoutes = [
  {
    path: "/identification-types",
    name: "identification-types.list",
    component: IdentificationTypesList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/identification-types/create",
    name: "identification-types.create",
    component: IdentificationTypesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/identification-types/edit/:id",
    name: "identification-types.edit",
    component: IdentificationTypesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
