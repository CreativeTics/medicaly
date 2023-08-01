import CountriesList from "./views/List.vue";
import CountriesCreate from "./views/CreateEdit.vue";

export const countriesRoutes = [
  {
    path: "/countries",
    name: "countries.list",
    component: CountriesList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/countries/create",
    name: "countries.create",
    component: CountriesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/countries/edit/:id",
    name: "countries.edit",
    component: CountriesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
