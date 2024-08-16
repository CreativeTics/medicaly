import Basics from './views/Basics.vue'

export const reportsRoutes = [
  {
    path: '/reports/basics',
    name: 'reports.basics',
    component: Basics,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
]
