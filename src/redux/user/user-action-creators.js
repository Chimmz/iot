import API from '../../utils/api';
import { CHANGE_NAME } from './user-actions';

export const setUser = user => {
   return { type: CHANGE_NAME, payload: {} };
};

export const loginUser = (username, password) => dispatch => {
   const res = API.loginUser(username, password);
};
