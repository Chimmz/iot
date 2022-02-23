import { ADD_ALERT, REMOVE_ALERT } from './alert-actions';

const INITIAL_STATE = {
   alerts: []
};

const alertReducer = (state = INITIAL_STATE, { type, payload }) => {
   switch (type) {
      case ADD_ALERT:
         if (state.alerts.find(a => a.msg === payload.alert.msg)) return state;

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
