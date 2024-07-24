import ExamsList from './views/List.vue'
import ExamsCreate from './views/CreateEdit.vue'
import ExamsPreview from './views/Preview.vue'
import TemplatesEdit from './views/TemplatesEdit.vue'

export const examsRoutes = [
  {
    path: '/exams',
    name: 'exams.list',
    component: ExamsList,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/exams/create',
    name: 'exams.create',
    component: ExamsCreate,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/exams/edit/:id',
    name: 'exams.edit',
    component: ExamsCreate,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/exams/preview/:id',
    name: 'exams.preview',
    component: ExamsPreview,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/exams/template/:id',
    name: 'templates.edit',
    component: TemplatesEdit,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
]
