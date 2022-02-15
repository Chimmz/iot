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

export const login = (username, password, showTermsAndCond) => {
   return async dispatch => {
      const handleFailure = msg =>
         dispatch(flashAlert(new Alert(msg, 'error')));

      try {
         const res = await API.loginUser(username, password);
         console.log(res);
         if (!res.userDetails.isAccepted) showTermsAndCond();

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
};

export const changePassword = (...details) => {
   return async dispatch => {
      try {
         const res = await API.changePassword(...details);
         console.log(res);

         const failure = res.message
            .toLowerCase()
            .includes('password change failed');

         dispatch(
            flashAlert(new Alert(res.message, failure ? 'error' : 'success'))
         );

         if (!failure) {
            // Do sth upon success
         }
      } catch (err) {
         dispatch(
            flashAlert(
               new Alert('Sorry, something wrong has happened', 'error')
            )
         );
      }
   };
};

export const resetPassword = (email, userToken) => async dispatch => {
   const res = await API.resetPassword(email, userToken);
   console.log(res);

   if (res.status === 400)
      return dispatch(
         flashAlert(new Alert('Something wrong occurred', 'error'))
      );

   // const { message, defaultPassword } = res;
   dispatch(flashAlert(new Alert(res.message, 'success')));
};
