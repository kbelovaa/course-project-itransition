import { $authHost, $host } from './index';

export const createItem = async (item) => {
  const { data } = await $authHost.post('item/create', item);
  return data;
};

export const fetchItems = async (collectionId) => {
  const { data } = await $host.get('item/all', { params: { collectionId } });
  return data;
};

export const getItem = async (itemId) => {
  const { data } = await $host.get(`item/${itemId}`);
  return data;
};

export const editItem = async (item, id) => {
  const { data } = await $authHost.patch(`item/edit/${id}`, item);
  return data;
};

export const deleteItem = async (id) => {
  const { data } = await $authHost.delete(`item/delete/${id}`);
  return data;
};

export const getLatestItems = async (limit) => {
  const { data } = await $host.get('item/latest', { params: { limit } });
  return data;
};
