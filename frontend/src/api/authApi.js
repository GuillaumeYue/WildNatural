import axios from 'axios'
import API from './axiosInstance'

// Public auth endpoints (no token needed) — use Krunal's /users routes,
// which return the full profile (role, address, languagePreference, …)
// rather than the older /auth routes that only returned name/email.
const publicApi = axios.create({ baseURL: 'http://localhost:5000/api' })

export const login = (formData) => publicApi.post('/users/login', formData)
export const register = (formData) => publicApi.post('/users/register', formData)

// Authenticated profile endpoints — go through the token-attaching instance.
export const getProfile = () => API.get('/users/profile')
export const updateProfile = (updates) => API.put('/users/profile', updates)

export default publicApi
