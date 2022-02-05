import { createSelector } from 'reselect';

export const selectAlert = state => state.alert;
export const selectAllAlerts = createSelector(
   [selectAlert],
   alert => alert.alerts
);
export const selectOneAlert = alertId => {
   return createSelector([selectAllAlerts], alerts =>
      alerts.find(a => a.id === alertId)
   );
};
