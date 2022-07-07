import * as userActions from './user-actions';

import * as alertCreators from '../alert/alert-creators';
import * as alertUtils from '../alert/alert-utils';

import API from '../../utils/apiUtils';
import { userStatus } from './user-utils';
import * as asyncUtils from '../../utils/asyncUtils';
import * as browserUtils from '../../utils/browserUtils';

// ------------------- Synchronous action creators: --------------------------

export const setUser = user => ({ type: userActions.SET_USER, payload: user });

export const logout = () => ({ type: userActions.LOGOUT_USER });

// The set loading action creator when fetching from API
export const setIsLoading = boolean => ({
   type: userActions.SET_IS_LOADING,
   payload: { isLoading: boolean },
});

// The set user accepted terms and conditions creator
export const setUserAccepted = boolean => ({
   type: userActions.SET_USER_ACCEPTED,
   payload: { isAccepted: boolean },
});

// The set user status message action creator
export const setUserStatusMsg = newStatus => ({
   type: userActions.SET_USER_STATUS_MSG,
   payload: { newStatus },
});

export const setUserPortfolio = portfolioArr => ({
   type: userActions.SET_USER_PORTFOLIO,
   payload: { portfolioArr },
});

export const changeUserRole = (roleType, newRole) => ({
   type: userActions.CHANGE_USER_ROLE,
   payload: { roleType, newRole },
});

// ------------------------ Asynchronous action creators: ----------------------------------

// The getLegal action creator
export const getLegalUser = async (userId, userToken) => {
   let res = await API.getLegalUser(userId, userToken);
   console.log(res);

   const hasAcceptedBefore = Boolean(res.legal);
   return setUserAccepted(hasAcceptedBefore);
};

// The login action creator
export function login(args) {
   const {
      loginDetails,
      rememberMe,
      pushEmailError,
      pushPasswordError,
      redirect,
      advanceLoginAttemptsCounter,
      resetLoginAttemptsCount,
   } = args;
   const { email, password } = loginDetails;

   const handleFieldError = err => {
      switch (err?.fieldName.toLowerCase()) {
         case 'username':
            pushEmailError(err.message);
            break;
         default:
            break;
      }
   };
   return async dispatch => {
      try {
         // makeRequest() returns a promise
         const makeRequest = () => {
            // fetchWithinTimeout races its arg with a timeout promise
            return asyncUtils.fetchWithinTimeout(
               API.loginUser(email, password)
            );
         };
         const loadingConfig = {
            startLoading: () => dispatch(setIsLoading(true)),
            stopLoading: () => dispatch(setIsLoading(false)),
         };
         const res = await asyncUtils.handleFetchLoadingState(
            makeRequest,
            loadingConfig
         );
         console.log(res);

         // First, check for response errors
         if (res?.errors) return res.errors.forEach(handleFieldError);

         // Second, check for a response message
         switch (res?.message) {
            case 'BAD CREDENTIALS':
               pushPasswordError('Wrong email or password entered');
               advanceLoginAttemptsCounter();
               break;

            case 'ACCOUNT_LOCKED':
               dispatch(
                  alertCreators.flashAlert(
                     new alertUtils.Alert(
                        'Your account is currently locked',
                        'error'
                     )
                  )
               );
               resetLoginAttemptsCount();
               break;

            case 'DEFAULT_PASSWORD':
               dispatch(setUser(res));
               resetLoginAttemptsCount();
               break;

            case 'USER_VALID':
               dispatch(setUser(res));
               resetLoginAttemptsCount();
               redirect();

               // Save user's login credentials as a browser cookie
               rememberMe &&
                  browserUtils.createCookie(
                     process.env.REACT_APP_REMEMBER_ME_COOKIE_KEY,
                     `${email}/${password}`,
                     999
                  );
               resetLoginAttemptsCount();
               break;
            default:
               pushPasswordError(res.message);
               advanceLoginAttemptsCounter();
         }
      } catch (err) {
         console.log('EERRROR: ', err);
      }
   };
}

// The change password action creator
export const changePassword = (userDetails, ...otherArgs) => {
   const [
      pushCurrPasswordError,
      navigate,
      displayAsModal,
      handleToggleDisplayPasswordModal,
   ] = otherArgs;

   return async dispatch => {
      try {
         const makeRequest = () =>
            // An unawaited promise is returned
            asyncUtils.fetchWithinTimeout(
               API.changePassword(
                  userDetails.userId,
                  userDetails.currentPassword,
                  userDetails.newPassword,
                  userDetails.userToken
               )
            );
         const startLoading = () => dispatch(setIsLoading(true));
         const stopLoading = () => dispatch(setIsLoading(false));

         const res = await asyncUtils.handleFetchLoadingState(makeRequest, {
            startLoading,
            stopLoading,
         });

         const failure = res.message
            .toLowerCase()
            .includes('password change failed');

         if (failure)
            return pushCurrPasswordError('Incorrect password entered'); // No return value though

         // On success...
         // Change user status message to USER_VALID
         dispatch(setUserStatusMsg(userStatus.USER_VALID));

         console.log(displayAsModal);
         if (displayAsModal) return handleToggleDisplayPasswordModal(true);

         // Now, display the change password success page
         navigate('/change-password/success', {
            state: { passwordChanged: true },
         });
         // 5secs later, go to dashboard
         setTimeout(() => {
            navigate('/dashboard', { replace: true });
         }, 5000);
      } catch (err) {
         console.log(err);
      }
   };
};
