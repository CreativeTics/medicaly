import { API_URL } from '@/config'
import { useAuthStore } from '@/store/auth'
import axios from 'axios'
export const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500,
  withCredentials: true,
})

// logout on 401
http.interceptors.response.use(async (response) => {
  if (response.status === 401) {
    // logout user
    await useAuthStore().logout()
  }
  return response
})
