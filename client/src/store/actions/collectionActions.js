import { SET_COLLECTIONS, SET_PAGE, SET_TOTAL_COUNT } from '../../constants/actionsRedux';
import { fetchCollections } from '../../http/collectionAPI';

export const setCollectionsAction = (payload) => ({
  type: SET_COLLECTIONS,
  payload,
});

export const setPageCollectionAction = (payload) => ({
  type: SET_PAGE,
  payload,
});

export const setTotalCountCollectionAction = (payload) => ({
  type: SET_TOTAL_COUNT,
  payload,
});

export const setCollectionsAsync = (userId, page, limit) => (dispatch) => {
  fetchCollections(userId, page, limit).then((data) => dispatch(setCollectionsAction(data.rows)));
};

export const setTotalCountCollectionAsync = (userId) => (dispatch) => {
  fetchCollections(userId).then((data) => dispatch(setTotalCountCollectionAction(data.count)));
};
