import { $host } from './index';

export const fetchPopularTags = async (limit) => {
  const { data } = await $host.get('tag/popular', { params: { limit } });
  return data;
};

export const fetchAllTags = async () => {
  const { data } = await $host.get('tag/all');
  return data;
};
