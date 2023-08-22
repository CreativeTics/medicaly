import PatientAttentionList from './views/List.vue'
import Attention from './views/Attention.vue'

export const patientAttentionRoutes = [
  {
    path: '/patient-attention',
    name: 'patient-attention.list',
    component: PatientAttentionList,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/patient-attention/:id',
    name: 'patient-attention.attention',
    component: Attention,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
]
