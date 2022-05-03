import * as notificationActions from './notifications-actions';
import * as userActions from '../user/user-actions.js';

const initState = { isLoading: false };

const notificationReducer = function (state = initState, action) {
   const { payload } = action;
   switch (action.type) {
      case notificationActions.GET_NOTIFICATIONS:
         return { ...state, [payload.portfolioName]: [...payload.incidents] };

      case notificationActions.SET_NOTIFICATIONS_LOADING:
         return { ...state, isLoading: payload.isLoading };

      case userActions.LOGOUT_USER:
         return initState;

      default:
         return state;
   }
};

export default notificationReducer;
