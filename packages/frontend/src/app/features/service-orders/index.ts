import ServiceOrdersList from "./views/List.vue";
import ServiceOrdersCreate from "./views/BulkCreate.vue";

export const serviceOrdersRoutes = [
  {
    path: "/service-orders",
    name: "service-orders.list",
    component: ServiceOrdersList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/service-orders/create",
    name: "service-orders.create",
    component: ServiceOrdersCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/service-orders/edit/:id",
    name: "service-orders.edit",
    component: ServiceOrdersCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
