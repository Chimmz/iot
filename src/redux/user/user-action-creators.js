import { SET_USER, LOGOUT_USER, SET_USER_ACCEPTED } from './user-actions';
import { flashAlert } from '../alert/alert-creators';
import * as alertUtils from '../alert/alert-utils';

import API from '../../utils/api';

// Synchronous redux action creators:
export const setUser = user => ({ type: SET_USER, payload: user });
export const logout = () => ({ type: LOGOUT_USER });

export const setUserAccepted = boolean => ({
   type: SET_USER_ACCEPTED,
   payload: { isAccepted: boolean }
});

// Async redux action creators:
export const login = (username, password) => {
   return async dispatch => {
      const handleFailure = msg =>
         dispatch(flashAlert(new alertUtils.Alert(msg, 'error')));

      try {
         const res = await API.loginUser(username, password);
         // console.log(res);

         switch (res.message) {
            case 'BAD_CREDENTIALS':
               handleFailure('Your username or password is incorrect');
               break;

            case 'ACCOUNT_LOCKED':
               handleFailure('Your account is currently locked');
               break;

            case 'DEFAULT_PASSWORD':
               dispatch(setUser(res));
               break;

            case 'USER_VALID':
               dispatch(setUser(res));
               dispatch(
                  flashAlert(
                     new alertUtils.Alert('Login successful', 'success')
                  )
               );
               break;
         }
      } catch (err) {
         console.log('EERRROR: ', err);
      }
   };
};

export const changePassword = (navigate, ...details) => {
   return async dispatch => {
      try {
         const res = await API.changePassword(...details);
         // console.log(res);

         const failure = res.message
            .toLowerCase()
            .includes('password change failed');

         if (!failure) return navigate('/change-password/success');

         dispatch(
            flashAlert(
               new alertUtils.Alert(res.message, failure ? 'error' : 'success')
            )
         );
      } catch (err) {
         dispatch(
            flashAlert(
               new alertUtils.Alert(
                  'Sorry, something wrong has happened',
                  'error'
               )
            )
         );
      }
   };
};

export const resetPassword = (email, navigate) => async dispatch => {
   const res = await API.resetPassword(email);
   // console.log(res);

   if (res.status === 400)
      return dispatch(
         flashAlert(new alertUtils.Alert('Something wrong occurred', 'error'))
      );

   navigate('/email-success');
};
