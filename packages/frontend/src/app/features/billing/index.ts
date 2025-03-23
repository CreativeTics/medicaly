// import Basics from './views/Basics.vue'
import BillingOrders from './views/BillingOrders.vue'
import Invoice from './views/Invoice.vue'
import InvoiceList from './views/InvoiceList.vue'
import List from './views/List.vue'
export const billingRoutes = [
  {
    path: '/billing/customers',
    name: 'billing.customers',
    component: List,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/billing/orders',
    name: 'billing.orders.detail',
    component: BillingOrders,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/billing/accounts',
    name: 'billing.accounts',
    component: BillingOrders,
    meta: {
      auth: true,
      layout: 'home',
    },
  },

  {
    path: '/billing/invoices',
    name: 'billing.invoices.list',
    component: InvoiceList,
    meta: {
      auth: true,
      layout: 'home',
    },
  },

  {
    path: '/billing/invoices/:id',
    name: 'billing.invoices.detail',
    component: Invoice,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
]
