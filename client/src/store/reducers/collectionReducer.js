import { SET_COLLECTIONS, SET_PAGE, SET_TOTAL_COUNT } from '../../constants/actionsRedux';

const defaultState = {
  collections: [],
  page: 1,
  limit: 10,
  totalCount: 0,
};

const collectionReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_COLLECTIONS:
      return { ...state, collections: [...action.payload] };
    case SET_PAGE:
      return { ...state, page: action.payload };
    case SET_TOTAL_COUNT:
      return { ...state, totalCount: action.payload };
    default:
      return state;
  }
};

export default collectionReducer;
