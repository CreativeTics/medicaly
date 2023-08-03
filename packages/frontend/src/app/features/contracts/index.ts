import ContractsList from "./views/List.vue";
import ContractsCreate from "./views/CreateEdit.vue";

export const contractsRoutes = [
  {
    path: "/contracts",
    name: "contracts.list",
    component: ContractsList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/contracts/create",
    name: "contracts.create",
    component: ContractsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/contracts/edit/:id",
    name: "contracts.edit",
    component: ContractsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
