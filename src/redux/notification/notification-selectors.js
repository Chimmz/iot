import { createSelector } from 'reselect';
import * as portfolioSelectors from '../portfolio/portfolio-selectors';

export const selectNotificationState = state => {
   return state.notification;
}

export const selectNotifications = createSelector(
   [selectNotificationState, portfolioSelectors.selectCurrentPortfolio],
   (notificationState, currentPortfolio) => notificationState[currentPortfolio?.name]
);

export const selectNotificationLoading = createSelector(
   [selectNotificationState],
   notification => notification.isLoading
);
