import {
  ADD_UNREAD_NOTIFICATION,
  REMOVE_NOTIFICATIONS,
  PUSH_UNREAD_NOTIFICATIONS
} from './notifications-actions';

import * as dateUtils from '../../utils/dateUtils';
import API from '../../utils/apiUtils';
import { fetchWithinTimeout } from '../../utils/asyncUtils';

export const addUnreadNotif = notif => ({
  type: PUSH_UNREAD_NOTIFICATIONS,
  payload: { notifs: [notif] }
});

export const loadNewNotifs = (currentPortfolio, userToken) => {
  return async dispatch => {
    const [fromDate, toDate] = dateUtils.getDateRangeBasedOnPeriod('1-day');
    try {
      const notifs = await fetchWithinTimeout(
        API.getNotifications(userToken, currentPortfolio.portfolioHeaderId, fromDate, toDate)
      );

      console.log('notifs: ', notifs);
      if (!notifs) return;
      const newNotif = notifs.slice(-1).pop();
      dispatch(addUnreadNotif(newNotif));
    } catch (err) {
      console.log(err);
    }
  };
};
