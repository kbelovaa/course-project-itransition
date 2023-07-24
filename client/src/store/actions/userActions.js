import { SET_USER, SET_IS_AUTH } from '../../constants/actionsRedux';
import { getUser } from '../../http/userAPI';

export const setUserAction = (payload) => ({
  type: SET_USER,
  payload,
});

export const setIsAuthAction = (payload) => ({
  type: SET_IS_AUTH,
  payload,
});

export const setUserAsync = (data) => (dispatch) => {
  getUser(data.id).then((data) => dispatch(setUserAction(data)));
};
