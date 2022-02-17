import { createSelector } from 'reselect';

export const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
   [selectUser],
   user => user.currentUser
);

export const selectUserLoggedIn = createSelector(
   [selectUser],
   user => user.isLoggedIn
);

export const selectUserToken = createSelector([selectUser], user => user.token);

export const selectUserStatusMsg = createSelector(
   [selectUser],
   user => user.message
);

export const selectUserAccepted = createSelector(
   [selectUser],
   user => user.currentUser.isAccepted
);
