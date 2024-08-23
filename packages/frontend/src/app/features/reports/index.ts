import Basics from './views/Basics.vue'
import List from './views/List.vue'

export const reportsRoutes = [
  {
    path: '/reports/basics',
    name: 'reports.basics',
    component: List,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/reports/basics/:id',
    name: 'reports.basics.view',
    component: Basics,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
]
