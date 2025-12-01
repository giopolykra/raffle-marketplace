import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:3000/api';  // Update to your backend

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

export const raffleAPI = {
  getAll: () => api.get('/raffles'),
  create: (data: any) => api.post('/raffles', data),
  buyTickets: (id: string, quantity: number) => api.post(`/raffles/${id}/buy`, { quantity }),
  drawWinner: (id: string) => api.post(`/raffles/${id}/draw`),
  getMyRaffles: () => api.get('/users/my-raffles'),
};

export default api;