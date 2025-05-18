import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://gameproject-htej.onrender.com' // 🔁 배포용
    : 'http://localhost:5000',                // 🧪 로컬 개발용
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
