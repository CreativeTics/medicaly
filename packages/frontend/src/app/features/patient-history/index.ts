import PatientHistoryList from './views/List.vue'
// import Laboratory from "./views/Laboratory.vue";

export const patientHistoryRoutes = [
  {
    path: '/patient-history',
    name: 'patient-history.list',
    component: PatientHistoryList,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/patient-history/:id',
    name: 'patient-history.detail',
    component: () => import('./views/History.vue'),
    meta: {
      auth: true,
      layout: 'home',
    },
  },
]
