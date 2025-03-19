import axios from 'axios';
import { refreshAccessToken } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/',
});

// Agregar JWToken de acceso a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Refrescar JWToken en caso de 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Evita loops si ya se ha reintentado
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Si falla el refresco, limpia tokens y redirige a login
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default api;