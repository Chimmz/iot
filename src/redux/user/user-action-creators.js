import API from '../../utils/api';
import { SET_USER, RESET_USER } from './user-actions';
import { flashAlert } from '../alert/alert-creators';
import { Alert } from '../alert/alert-utils';

export const setUser = userDetails => ({
   type: SET_USER,
   payload: userDetails
});

export const resetUser = () => ({ type: RESET_USER });

export const loginUser = (username, password, navigate) => async dispatch => {
   const handleSuccess = () => {
      dispatch(flashAlert(new Alert('Login successful', 'success')));
      dispatch(setUser(res));
   };

   const handleFailure = msg => {
      dispatch(flashAlert(new Alert(msg, 'error')));
      dispatch(resetUser());
   };

   const res = await API.loginUser(username, password);
   console.log(res);

   switch (res.message) {
      case 'BAD_CREDENTIALS':
         handleFailure('Your username or password is incorrect');
         break;

      case 'ACCOUNT_LOCKED':
         handleFailure('Your account is currently locked');
         break;

      case 'DEFAULT_PASSWORD':
         navigate('/change-password');
         break;

      case 'USER_VALID':
         handleSuccess();
         break;
   }
};
