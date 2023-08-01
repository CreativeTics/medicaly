import EmployeesList from "./views/List.vue";
import EmployeesCreate from "./views/CreateEdit.vue";

export const employeesRoutes = [
  {
    path: "/employees",
    name: "employees.list",
    component: EmployeesList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/employees/create",
    name: "employees.create",
    component: EmployeesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/employees/edit/:id",
    name: "employees.edit",
    component: EmployeesCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
