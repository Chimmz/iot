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

export const selectUserViewRole = createSelector(
   [selectCurrentUserRoles],
   roles => roles?.find(role => role?.roleType.toLowerCase() === 'view')
);

export const selectUserAccessRole = createSelector(
   [selectCurrentUserRoles],
   roles => roles?.find(role => role?.roleType.toLowerCase() === 'access')
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

// This is for fetching the roles to render the data in the dashboard UI
// using by dashboard highlights and dashboard home.
export const userRoles = createSelector(
   [selectUser],
   user => user.currentUser.roles
);
