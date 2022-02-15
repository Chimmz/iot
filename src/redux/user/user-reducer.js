import { RESET_USER, SET_USER, LOGOUT_USER } from './user-actions';

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

      case RESET_USER:
      case LOGOUT_USER:
         return { isLoggedIn: false, currentUser: {} };

      default:
         return state;
   }
};

export default userReducer;
