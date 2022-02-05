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
