import { CHANGE_NAME } from './user-actions';

const initState = {
   name: 'Chima',
   password: 'chima125'
};

const userReducer = function (state = initState, action) {
   const { type, payload } = action;

   switch (type) {
      case CHANGE_NAME:
         return { ...state, name: payload.name };

      default:
         return state;
   }
};

export default userReducer;
