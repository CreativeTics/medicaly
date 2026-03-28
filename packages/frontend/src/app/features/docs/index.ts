import DocsView from './views/DocsView.vue'

export const docsRoutes = [
  {
    path: '/docs/dynamic-forms',
    name: 'docs.dynamic-forms',
    component: DocsView,
    meta: {
      auth: true,
      layout: 'public',
    },
  },
]
