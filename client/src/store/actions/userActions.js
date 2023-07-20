import { SET_USER, SET_IS_AUTH } from '../../constants/actionsRedux';
import { check } from '../../http/authAPI';
import { getUser } from '../../http/userAPI';

export const setUserAction = (payload) => ({
  type: SET_USER,
  payload,
});

export const setIsAuthAction = (payload) => ({
  type: SET_IS_AUTH,
  payload,
});

export const setUserAsync = () => (dispatch) => {
  check()
    .then((data) => getUser(data.id))
    .then((data) => dispatch(setUserAction(data)));
};
