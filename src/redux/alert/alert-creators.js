import { ADD_ALERT, REMOVE_ALERT } from './alert-actions';

export const addAlert = alert => ({ type: ADD_ALERT, payload: { alert } });
export const removeAlert = id => ({ type: REMOVE_ALERT, payload: { id } });

export const flashAlert = (alert, timeout = 5000) => {
   return dispatch => {
      setTimeout(() => dispatch(removeAlert(alert.id)), timeout);
      dispatch(addAlert(alert));
   };
};
