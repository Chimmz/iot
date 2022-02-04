import { createSelector } from 'reselect';

export const selectUser = state => state.user;

export const selectUsername = createSelector([selectUser], user => user.name);
