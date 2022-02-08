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
   const res = await API.loginUser(username, password);

   res.userStatusMsg = res.message;
   delete res.message;
   console.log(res);

   const handleFailure = msg => dispatch(flashAlert(new Alert(msg, 'error')));

   switch (res.userStatusMsg) {
      case 'BAD_CREDENTIALS':
         handleFailure('Your username or password is incorrect');
         break;

      case 'ACCOUNT_LOCKED':
         dispatch(setUser(res));
         handleFailure('Your account is currently locked');
         break;

      case 'DEFAULT_PASSWORD':
         dispatch(setUser(res));
         navigate('/change-password', { replace: true });
         break;

      case 'USER_VALID':
         dispatch(setUser(res));
         dispatch(flashAlert(new Alert('Login successful', 'success')));
         break;
   }
};
