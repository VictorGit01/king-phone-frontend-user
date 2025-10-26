import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333' // ✅ Confirmar se está correto
});

// 🆕 Adicionar interceptors para debug
api.interceptors.request.use(config => {
  console.log('🚀 API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`
  });
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    });
    return Promise.reject(error);
  }
);