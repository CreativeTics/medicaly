import DepartmentsList from "./views/List.vue";
import DepartmentsCreate from "./views/CreateEdit.vue";

export const departmentsRoutes = [
  {
    path: "/departments",
    name: "departments.list",
    component: DepartmentsList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/departments/create",
    name: "departments.create",
    component: DepartmentsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/departments/edit/:id",
    name: "departments.edit",
    component: DepartmentsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
