import { SET_USER, LOGOUT_USER, SET_USER_ACCEPTED } from './user-actions';

const initState = { isLoggedIn: false, currentUser: {} };

const userReducer = function (state = initState, action) {
   const { type, payload } = action;

   switch (type) {
      case SET_USER:
         const { userDetails, ...rest } = payload;
         return {
            currentUser: userDetails,
            isLoggedIn: Boolean(rest.token?.length),
            ...rest
         };

      case SET_USER_ACCEPTED:
         return { ...state, isAccepted: payload.isAccepted };

      case LOGOUT_USER:
         return { isLoggedIn: false, currentUser: {} };

      default:
         return state;
   }
};

export default userReducer;
