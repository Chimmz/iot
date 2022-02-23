import * as userActions from './user-actions';

import * as alertCreators from '../alert/alert-creators';
import * as alertUtils from '../alert/alert-utils';

import API from '../../utils/api';
import { userStatus } from './user-utils';
import * as asyncUtils from '../../utils/asyncUtils';
import * as browserUtils from '../../utils/browserUtils';

// ======== Synchronous redux action creators: ============

export const setUser = user => ({ type: userActions.SET_USER, payload: user });
export const logout = () => ({ type: userActions.LOGOUT_USER });

// Action to set a loading state when fetching from API
export const setIsLoading = boolean => ({
   type: userActions.SET_IS_LOADING,
   payload: { isLoading: boolean }
});

// Action to set if the user has accepted terms and conditions
export const setUserAccepted = boolean => ({
   type: userActions.SET_USER_ACCEPTED,
   payload: { isAccepted: boolean }
});

// Action to set user status message action creator
export const setUserStatusMsg = newStatus => ({
   type: userActions.SET_USER_STATUS_MSG,
   payload: { newStatus }
});

// ======== Asynchronous redux action creators: ============

// The login action creator
export const login = (username, password, rememberMe) => async dispatch => {
   const handleFailure = msg =>
      dispatch(alertCreators.flashAlert(new alertUtils.Alert(msg, 'error')));

   // A function that returns a promise
   const getResponse = () =>
      asyncUtils.getResponseWithinTimeout(API.loginUser(username, password));

   try {
      const res = await asyncUtils.handleLoadingStateAsync(
         getResponse,
         setIsLoading,
         dispatch
      );
      console.log(res);

      switch (res?.message) {
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
            browserUtils.createCookie('_itek-remember', rememberMe, 14);

            dispatch(setUser(res));
            dispatch(
               alertCreators.flashAlert(
                  new alertUtils.Alert('Login successful', 'success')
               )
            );
            break;
      }
   } catch (err) {
      console.log('EERRROR: ', err);
   }
};

// The change password action creator
export const changePassword = (navigate, ...details) => {
   return async dispatch => {
      try {
         // A function that returns a promise
         const getResponse = () =>
            asyncUtils.getResponseWithinTimeout(API.changePassword(...details));

         const res = await asyncUtils.handleLoadingStateAsync(
            getResponse,
            setIsLoading,
            dispatch
         );
         console.log(res);

         const failure = res.message
            .toLowerCase()
            .includes('password change failed');

         if (failure)
            return dispatch(
               alertCreators.flashAlert(
                  new alertUtils.Alert(
                     res.message,
                     failure ? 'error' : 'success'
                  )
               )
            );

         // On success
         // Change user status message to USER_VALID
         dispatch(setUserStatusMsg(userStatus.USER_VALID));
         navigate('/change-password/success', { replace: true });
         setTimeout(() => {
            navigate('/dashboard', { replace: true });
         }, 5000);
      } catch (err) {
         dispatch(
            alertCreators.flashAlert(
               new alertUtils.Alert(
                  'Sorry, something wrong has happened',
                  'error'
               )
            )
         );
      }
   };
};

// The reset password action creator
export const resetPassword = (email, navigate) => async dispatch => {
   try {
      // A function that returns a promise
      const getResponse = () =>
         asyncUtils.getResponseWithinTimeout(API.resetPassword(email));

      const res = await asyncUtils.handleLoadingStateAsync(
         getResponse,
         setIsLoading,
         dispatch
      );
      console.log(res);

      if (res.errorCode === 'AMS403') {
         dispatch(
            alertCreators.flashAlert(
               new alertUtils.Alert(
                  "This email address doesn't exist in our database",
                  'error'
               )
            )
         );
         return;
      }

      // Redirect to emailSuccess page
      navigate('/email-success');
   } catch (err) {
      console.log('Error: ', err);
   }
};
