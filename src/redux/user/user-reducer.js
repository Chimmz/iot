import * as userActions from './user-actions';

const initState = { isLoggedIn: false, currentUser: {}, isLoading: false };

const userReducer = function (state = initState, action) {
   const { type, payload } = action;

   switch (type) {
      case userActions.SET_USER:
         const { userDetails, ...rest } = payload;

         return {
            currentUser: userDetails,
            isLoggedIn: Boolean(rest.token?.length),
            ...rest
         };

      case userActions.SET_USER_STATUS_MSG:
         return { ...state, message: payload.newStatus };

      case userActions.SET_USER_ACCEPTED:
         return { ...state, isAccepted: payload.isAccepted };

      case userActions.SET_IS_LOADING:
         return { ...state, isLoading: payload.isLoading };

      case userActions.SET_USER_PORTFOLIO:
         return {
            ...state,
            currentUser: {
               ...state.currentUser,
               portfolio: payload.portfolioArr
            }
         };

      case userActions.CHANGE_USER_ROLE:
         let { roleType, newRole } = action.payload;
         roleType = roleType.toUpperCase();

         const validRoleTypes = ['VIEW', 'ACCESS'];
         if (!validRoleTypes.includes(roleType) || !newRole) return state;

         // Replace only matching role type with the new role
         const updatedUserRoles = state.currentUser.roles.map(role =>
            role.roleType === roleType ? newRole : role
         );

         return {
            ...state,
            currentUser: { ...state.currentUser, roles: updatedUserRoles }
         };

      case userActions.LOGOUT_USER:
         return { isLoggedIn: false, currentUser: {} };

      default:
         return state;
   }
};

export default userReducer;
