import PatientAdmissionList from "./views/List.vue";
import Admission from "./views/Admission.vue";

export const patientAdmissionRoutes = [
  {
    path: "/patient-admission",
    name: "patient-admission.list",
    component: PatientAdmissionList,
    meta: {
      auth: true,
      layout: "home",
    },
  },
  {
    path: "/patient-admission/:id",
    name: "patient-admission.admission",
    component: Admission,
    meta: {
      auth: true,
      layout: "home",
    },
  },
];
