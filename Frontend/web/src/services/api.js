import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Change to your IP later

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post('/login', { email, password });
export const getUsers = () => api.get('/users');
export const registerTeacher = (data) => api.post('/register', data);
export const getMyStudents = () => api.get('/my-students');

export default api;