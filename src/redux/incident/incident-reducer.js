import * as inicidentActions from './incident-actions.js';
import * as userActions from '../user/user-actions.js';

const initState = { isLoading: false };

const incidentReducer = function (state = initState, action) {
   const { payload } = action;

   switch (action.type) {
      case inicidentActions.GET_INCIDENTS:
         return { ...state, [payload.portfolioName]: [...payload.incidents] };

      case inicidentActions.SET_INCIDENTS_LOADING:
         return { ...state, isLoading: payload.isLoading };

      case userActions.LOGOUT_USER:
         return initState;

      default:
         return state;
   }
};

export default incidentReducer;
