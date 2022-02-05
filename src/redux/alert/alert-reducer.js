import { ADD_ALERT, REMOVE_ALERT } from './alert-actions';

const INITIAL_STATE = {
   alerts: [
      // {
      //    msg: 'Wrong user ID or pasword entered',
      //    type: 'error',
      //    id: '234'
      // },
      // {
      //    msg: 'Login successful',
      //    type: 'success',
      //    id: '235'
      // }
   ]
};

const alertReducer = (state = INITIAL_STATE, { type, payload }) => {
   switch (type) {
      case ADD_ALERT:
         return { alerts: [payload.alert, ...state.alerts] };

      case REMOVE_ALERT:
         return {
            alerts: state.alerts.filter(alert => alert.id !== payload.id)
         };
      default:
         return state;
   }
};
export default alertReducer;
