import { createSelector } from 'reselect';

export const selectNotification = state => state.notification;

export const selectUnreadNotifs = createSelector(
   [selectNotification],
   notif => notif.newNotifs
);

// This count will be displayed as a red mark in the Header component
export const selectUnreadNotifsCount = createSelector(
   [selectUnreadNotifs],
   notifs => notifs.length
);

export const selectPastOneDayNotifsCount = createSelector(
   selectNotification,
   notif => notif.pastOneDayNotifsCount
);

export const selectLastReadNotif = createSelector(
   selectNotification,
   notif => notif.lastReadNotif
);
