import { SET_ITEMS } from '../../constants/actionsRedux';

const defaultState = {
  items: [],
};

const itemReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_ITEMS:
      return { ...state, items: [...action.payload] };
    default:
      return state;
  }
};

export default itemReducer;
