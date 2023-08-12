import PatientLaboratoryList from "./views/List.vue";
// import Laboratory from "./views/Laboratory.vue";

export const patientLaboratoryRoutes = [
  {
    path: "/patient-laboratories",
    name: "patient-laboratories.list",
    component: PatientLaboratoryList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/patient-laboratories/:id",
    name: "patient-laboratories.laboratories",
    component: PatientLaboratoryList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
