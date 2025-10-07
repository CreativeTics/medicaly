import { API_URL } from '@/config'

import axios from 'axios'
export const publicHttp = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300,
})
