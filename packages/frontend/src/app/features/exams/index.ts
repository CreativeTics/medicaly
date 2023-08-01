import ExamsList from "./views/List.vue";
import ExamsCreate from "./views/CreateEdit.vue";

export const examsRoutes = [
  {
    path: "/exams",
    name: "exams.list",
    component: ExamsList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/exams/create",
    name: "exams.create",
    component: ExamsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/exams/edit/:id",
    name: "exams.edit",
    component: ExamsCreate,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
