import ServiceOrdersCreate from './views/BulkCreate.vue'
import ServiceOrdersDetail from './views/Detail.vue'
import ServiceEdit from './views/Edit.vue'
import ServiceOrdersList from './views/List.vue'

export const serviceOrdersRoutes = [
  {
    path: '/service-orders',
    name: 'service-orders.list',
    component: ServiceOrdersList,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/service-orders/create',
    name: 'service-orders.create',
    component: ServiceOrdersCreate,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/service-orders/view/:id',
    name: 'service-orders.view',
    component: ServiceOrdersDetail,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/service-orders/:id',
    name: 'service-orders.edit',
    component: ServiceEdit,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
]
