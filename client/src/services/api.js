import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    '[api.js] VITE_API_URL is not defined. ' +
    'Set it in .env (local) or .env.production (Vercel build).'
  );
}

const API = axios.create({
  baseURL: API_BASE_URL,
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
