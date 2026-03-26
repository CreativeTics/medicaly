import OrganizationView from "./views/Organization.vue";

export const organizationsRoutes = [
  {
    path: "/organizations",
    name: "organizations.view",
    component: OrganizationView,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
