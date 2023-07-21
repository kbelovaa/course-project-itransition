import { $authHost, $host } from './index';

export const createComment = async (text, userId, itemId) => {
  const { data } = await $authHost.post('comment/create', { text, userId, itemId });
  return data;
};

export const fetchComments = async (itemId) => {
  const { data } = await $host.get(`comment/all/${itemId}`);
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await $authHost.delete(`comment/delete/${commentId}`);
  return data;
};
