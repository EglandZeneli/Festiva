import axios from 'axios';
import { useAuth } from './context/AuthContext';

const instance = axios.create();

instance.interceptors.request.use(config => {
  const { token } = useAuth();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
