import axios from 'axios'
import constants from '../../../../config'

export const couchHttp = axios.create({
  baseURL: constants().DB.URL,
  auth: {
    username: constants().DB.USERNAME,
    password: constants().DB.PASSWORD,
  },
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500,
})
