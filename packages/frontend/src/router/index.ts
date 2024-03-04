import { useAuthStore } from '../store/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const isAuthenticated = useAuthStore().isAuthenticated
  if (to.meta.auth && !isAuthenticated) return '/'
})

export default router
