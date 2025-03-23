import Basics from './views/Basics.vue'
import List from './views/List.vue'
import Rips from './views/Rips.vue'

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
  {
    path: '/reports/rips',
    name: 'reports.rips',
    component: Rips,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
]
