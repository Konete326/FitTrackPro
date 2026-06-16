import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/home', '/about', '/contact', '/login', '/register', '/forgot-password', '/reset-password'];
      const isPublicPath = publicPaths.some(p => currentPath === p || currentPath.startsWith('/reset-password'));
      if (!isPublicPath) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
