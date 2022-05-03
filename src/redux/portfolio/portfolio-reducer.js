import { SET_PORTFOLIOS, SET_CURRENT_PORTFOLIO } from './portfolio-actions';
import * as userActions from '../user/user-actions.js';

const initState = {
   portfolios: []
};

const portfolioReducer = function (state = initState, action) {
   const { type, payload } = action;

   switch (type) {
      case SET_PORTFOLIOS:
         return { ...state, portfolios: payload.portfolios };

      case SET_CURRENT_PORTFOLIO:
         const portfolios = state.portfolios.map(p => {
            if (p.name === payload.name) return { ...p, isCurrent: true };
            // Remove the isCurrent status from any other portfolio previously set as current
            delete p.isCurrent;
            return p;
         });

         return { ...state, portfolios };

      case userActions.LOGOUT_USER:
         return initState;

      default:
         return state;
   }
};

export default portfolioReducer;
