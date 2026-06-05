import axios from 'axios'
import { API_BASE_URL } from './apiBase'

const API = axios.create({ baseURL: API_BASE_URL })

API.interceptors.request.use((req) => {
  // Tolerate the different token conventions in play across the app
  // (userInfo / user objects, or a raw token). Pick the first that exists.
  const userInfo = localStorage.getItem('userInfo')
  const user = localStorage.getItem('user')
  const token = localStorage.getItem('token')

  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`
  } else if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`
  } else if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }

  return req
})

export default API
