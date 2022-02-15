import API from '../../utils/api';
import { SET_USER, RESET_USER, LOGOUT_USER } from './user-actions';
import { flashAlert } from '../alert/alert-creators';
import { Alert } from '../alert/alert-utils';

export const setUser = userDetails => ({
   type: SET_USER,
   payload: userDetails
});

export const resetUser = () => ({ type: RESET_USER });
export const logout = () => ({ type: LOGOUT_USER });

export const changePassword = (...details) => {
   return async dispatch => {
      try {
         const res = await API.changePassword(...details);

         if (res.message.toLowerCase().includes('Password change failed'))
            return dispatch(flashAlert(new Alert(res.message)));

         dispatch(flashAlert(new Alert(res.message, 'success')));
      } catch (err) {
         dispatch(
            flashAlert(
               new Alert('Sorry, something wrong has happened', 'error')
            )
         );
      }
   };
};

export const login = (username, password) => async dispatch => {
   const handleFailure = msg => dispatch(flashAlert(new Alert(msg, 'error')));

   try {
      const res = await API.loginUser(username, password);
      console.log(res);

      switch (res.message) {
         case 'BAD_CREDENTIALS':
            // console.log('In BAD_CREDENTIALS');
            handleFailure('Your username or password is incorrect');
            break;

         case 'ACCOUNT_LOCKED':
            // console.log('In ACCOUNT_LOCKED');
            // dispatch(setUser(res));
            handleFailure('Your account is currently locked');
            break;

         case 'DEFAULT_PASSWORD':
            // console.log('In DEFAULT_PASSWORD');
            dispatch(setUser(res));
            break;

         case 'USER_VALID':
            // console.log('In USER_VALID');
            dispatch(setUser(res));
            dispatch(flashAlert(new Alert('Login successful', 'success')));
            break;
      }
   } catch (err) {
      handleFailure('Sorry, something wrong has happened');
   }
};
