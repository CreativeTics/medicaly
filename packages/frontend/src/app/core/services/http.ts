import { API_URL } from '@/config'
import axios from 'axios'
export const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500,
})
