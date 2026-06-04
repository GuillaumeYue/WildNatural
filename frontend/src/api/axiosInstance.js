import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo')
  const user = localStorage.getItem('user')
  const token = localStorage.getItem('token')

  if (userInfo) {
    const parsedUser = JSON.parse(userInfo)
    req.headers.Authorization = `Bearer ${parsedUser.token}`
  } else if (user) {
    const parsedUser = JSON.parse(user)
    req.headers.Authorization = `Bearer ${parsedUser.token}`
  } else if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }

  return req
})

export default API