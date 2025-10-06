import { API_URL } from '@/config'
import { useAuthStore } from '@/store/auth'
import axios from 'axios'
const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300,
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { status } = error.response

    // if login page, do nothing

    if (window.location.pathname === '/') {
      return Promise.reject(error)
    }

    // Manejo de errores 401 y 403
    if (status === 401 || status === 403) {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        await authStore.logout()
      }
    }
    return Promise.reject(error)
  }
)

export { http }
