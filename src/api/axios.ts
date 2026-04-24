import axios from 'axios';

const api = axios.create({
  // This tells the frontend to use the proxy we just set up in Vite
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;