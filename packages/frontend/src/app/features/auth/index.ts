import Login from './auth/views/Login.vue'
import RolesList from './roles/views/List.vue'
import RolesCreate from './roles/views/CreateEdit.vue'
import UsersList from './users/views/List.vue'
import UsersCreate from './users/views/CreateEdit.vue'
import Sessions from './auth/views/Sessions.vue'

export const authRoutes = [
  {
    path: '/',
    name: 'auth.login',
    component: Login,
    meta: {
      auth: false,
      layout: 'login',
    },
  },
  {
    path: '/roles',
    name: 'roles.list',
    component: RolesList,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/roles/create',
    name: 'roles.create',
    component: RolesCreate,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/roles/edit/:id',
    name: 'roles.edit',
    component: RolesCreate,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/users',
    name: 'users.list',
    component: UsersList,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/users/create',
    name: 'users.create',
    component: UsersCreate,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/users/edit/:id',
    name: 'users.edit',
    component: UsersCreate,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
  {
    path: '/sessions',
    name: 'auth.sessions',
    component: Sessions,
    meta: {
      auth: true,
      layout: 'home',
    },
  },
]
