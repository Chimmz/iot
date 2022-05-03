import { createSelector } from 'reselect';

// THIS FILE CREATES SELECTORS OF THE USER STATE IN THE REDUX STATE

export const selectUser = state => state.user;

export const selectCurrentUser = createSelector(
   [selectUser],
   user => user.currentUser
);

export const selectCurrentUserRoles = createSelector(
   [selectCurrentUser],
   currentUser => currentUser.roles
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
   user => user.isAccepted
);

export const selectIsLoading = createSelector(
   [selectUser],
   user => user.isLoading
);

export const selectUserPortfolio = createSelector(
   [selectUser],
   user => user.portfolio
);
