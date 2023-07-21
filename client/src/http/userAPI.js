import { $authHost, $host } from './index';

export const fetchUsers = async (page, limit = 10) => {
  const { data } = await $authHost.get('user/all', { params: { page, limit } });
  return data;
};

export const getUser = async (id) => {
  const { data } = await $host.get(`user/${id}`);
  return data;
};

export const changeStatus = async (id, status) => {
  const { data } = await $authHost.patch('user/status', { id, status });
  return data;
};

export const changeRole = async (id, role) => {
  const { data } = await $authHost.patch('user/rights', { id, role });
  return data;
};

export const remove = async (id) => {
  const { data } = await $authHost.delete(`user/delete/${id}`);
  return data;
};
