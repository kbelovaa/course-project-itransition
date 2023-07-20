import { SET_ITEMS } from '../../constants/actionsRedux';
import { fetchItems } from '../../http/itemAPI';

export const setItemsAction = (payload) => ({
  type: SET_ITEMS,
  payload,
});

export const setItemsAsync = (collectionId) => (dispatch) => {
  fetchItems(collectionId).then((data) => dispatch(setItemsAction(data)));
};
