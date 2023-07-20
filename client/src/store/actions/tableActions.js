import { SET_USERS, SET_PAGE, SET_TOTAL_COUNT } from '../../constants/actionsRedux';
import { fetchUsers } from '../../http/userAPI';

export const setUsersAction = (payload) => ({
  type: SET_USERS,
  payload,
});

export const setPageTableAction = (payload) => ({
  type: SET_PAGE,
  payload,
});

export const setTotalCountTableAction = (payload) => ({
  type: SET_TOTAL_COUNT,
  payload,
});

export const setUsersAsync = (page, limit) => (dispatch) => {
  fetchUsers(page, limit).then((data) => dispatch(setUsersAction(data.rows)));
};

export const setTotalCountTableAsync = () => (dispatch) => {
  fetchUsers().then((data) => dispatch(setTotalCountTableAction(data.count)));
};
