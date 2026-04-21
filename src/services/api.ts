import axios from 'axios';
import { logger } from '../utils/logger';

const rawBaseURL = import.meta.env.VITE_API_URL;

// Normaliza para evitar `//` quando concatenar com paths.
const baseURL = rawBaseURL ? rawBaseURL.replace(/\/+$/, '') : undefined;

export const api = axios.create({
  // Em prod, configure via VITE_API_URL (sem barra no final).
  // Fallback localhost ajuda no dev local quando env não foi setada.
  baseURL: baseURL ?? 'http://localhost:3333'
});

// Debug leve só em dev (evita poluir produção e logs do deploy).
if (import.meta.env.DEV) {
  api.interceptors.request.use(config => {
  logger.debug('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    return config;
  });

  api.interceptors.response.use(
    response => {
  logger.debug('API Response:', {
        status: response.status,
        url: response.config.url
      });
      return response;
    },
    error => {
  logger.error('API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message
      });
      return Promise.reject(error);
    }
  );
}