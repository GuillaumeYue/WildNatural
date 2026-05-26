import axios from 'axios';

// Set the base URL to your backend server
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const login = (formData) => API.post('/login', formData);
export const register = (formData) => API.post('/signup', formData);

export default API;