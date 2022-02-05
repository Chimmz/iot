import { RESET_USER, SET_USER } from './user-actions';

const initState = { isLoggedIn: false, currentUser: {} };

const userReducer = function (state = initState, action) {
   const { type, payload } = action;

   switch (type) {
      case SET_USER:
         const { user, token, ...rest } = payload;
         return {
            ...rest,
            currentUser: user,
            isLoggedIn: Boolean(token?.length)
         };

      case RESET_USER:
         return { isLoggedIn: false, currentUser: {} };

      default:
         return state;
   }
};

export default userReducer;
