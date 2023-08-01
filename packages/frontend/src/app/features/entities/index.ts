import EntitiesList from "./views/List.vue";
import EntitiesCreate from "./views/CreateEdit.vue";

export const entitiesRoutes = [
  {
    path: "/entities",
    name: "entities.list",
    component: EntitiesList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/entities/create",
    name: "entities.create",
    component: EntitiesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/entities/edit/:id",
    name: "entities.edit",
    component: EntitiesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
