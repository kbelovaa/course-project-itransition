import { $authHost, $host } from './index';

export const changeLike = async (userId, itemId) => {
  const { data } = await $authHost.patch('like', { userId, itemId });
  return data;
};

export const getLike = async (userId, itemId) => {
  const { data } = await $authHost.get('like/one', { params: { userId, itemId } });
  return data;
};

export const fetchLikes = async (itemId) => {
  const { data } = await $host.get('like/all/' + itemId);
  return data;
};
