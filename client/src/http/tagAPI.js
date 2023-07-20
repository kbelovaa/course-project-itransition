import { $host } from './index';

export const fetchTags = async (limit) => {
  const { data } = await $host.get('tag/popular', { params: { limit } });
  return data;
};
