import CitiesList from "./views/List.vue";
import CitiesCreate from "./views/CreateEdit.vue";

export const citiesRoutes = [
  {
    path: "/cities",
    name: "cities.list",
    component: CitiesList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/cities/create",
    name: "cities.create",
    component: CitiesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/cities/edit/:id",
    name: "cities.edit",
    component: CitiesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
