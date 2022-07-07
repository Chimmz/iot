import * as notifActions from './notifications-actions';
import * as userActions from '../user/user-actions.js';

const initState = {
   newNotifs: [],
   pastOneDayNotifsCount: 0,
   lastReadNotif: null,
};

const notificationReducer = function (state = initState, action) {
   const { type, payload } = action;

   switch (type) {
      case notifActions.PUSH_UNREAD_NOTIFICATIONS:
         return {
            ...state,
            newNotifs: [...payload.notifs, ...state.newNotifs],
         };

      case notifActions.SET_UNREAD_NOTIFICATIONS:
         return { ...state, newNotifs: payload.notifs };

      case notifActions.REMOVE_NOTIFICATIONS:
         return { ...state, newNotifs: [] };

      case notifActions.SET_PAST_ONE_DAY_NOTIFS_COUNT:
         return { ...state, pastOneDayNotifsCount: payload.count };

      case notifActions.SET_LAST_READ_NOTIF:
         return { ...state, lastReadNotif: payload.notif };

      case userActions.LOGOUT_USER:
         return initState;

      default:
         return state;
   }
};

export default notificationReducer;
