import { $authHost, $host } from './index';

export const createCollection = async (collection) => {
  const { data } = await $authHost.post('collection/create', collection);
  return data;
};

export const fetchCollections = async (userId, page, limit = 10) => {
  const { data } = await $host.get('collection/all', { params: { userId, page, limit } });
  return data;
};

export const getCollection = async (collectionId) => {
  const { data } = await $host.get('collection/' + collectionId);
  return data;
};

export const editCollection = async (collection, id) => {
  const { data } = await $authHost.patch('collection/edit/' + id, collection);
  return data;
};

export const deleteCollection = async (id) => {
  const { data } = await $authHost.delete('collection/delete/' + id);
  return data;
};

export const getLargestCollections = async (limit) => {
  const { data } = await $host.get('collection/largest', { params: { limit } });
  return data;
};
