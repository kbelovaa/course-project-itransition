import jwtDecode from 'jwt-decode';
import { $authHost, $host } from './index';

export const registration = async (name, email, password) => {
  const { data } = await $host.post('auth/registration', { name, email, password, role: 'USER' });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const login = async (email, password) => {
  const { data } = await $host.post('auth/login', { email, password });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const check = async () => {
  const { data } = await $authHost.get('auth/auth');
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};
