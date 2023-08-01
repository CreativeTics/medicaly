import PositionsList from "./views/List.vue";
import PositionsCreate from "./views/CreateEdit.vue";

export const positionsRoutes = [
  {
    path: "/positions",
    name: "positions.list",
    component: PositionsList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/positions/create",
    name: "positions.create",
    component: PositionsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/positions/edit/:id",
    name: "positions.edit",
    component: PositionsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
