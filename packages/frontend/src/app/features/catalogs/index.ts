import CatalogsList from './views/List.vue'
import CatalogItems from './views/Items.vue'

export const catalogsRoutes = [
  {
    path: '/catalogs',
    name: 'catalogs.list',
    component: CatalogsList,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/catalogs/:catalogKey/items',
    name: 'catalogs.items',
    component: CatalogItems,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
]
