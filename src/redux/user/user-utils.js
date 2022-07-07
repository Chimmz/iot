export const userStatus = {
   USER_VALID: 'USER_VALID',
   DEFAULT_USER: 'DEFAULT_USER',
};

export const getFullName = function () {
   return this?.firstName + ' ' + this?.lastName;
};
export const getUserAccessRole = function () {
   return this?.roles?.find(role => role.roleType === 'ACCESS');
};
export const getUserViewRole = function () {
   return this?.roles?.find(role => role.roleType === 'VIEW');
};

export function restrictOperation(user) {
   // console.log(this, user);
   const userAccessRole = getUserAccessRole.call(user);
   const loggedInUserAccessRole = getUserAccessRole.call(this);

   const status = { isAuthorized: false };
   switch (loggedInUserAccessRole.code) {
      case 'SUPER_ADMIN':
         console.log('Authorized because logged in user is super admin');
         status.isAuthorized = true;
         break;
      case 'ADMIN':
         if (userAccessRole.code === 'SUPER_ADMIN') {
            status.isAuthorized = false;
            break;
         }
         console.log(
            'Authorized because user to be operated upon is an admin/user, and logged in user is an admin'
         );
         status.isAuthorized = true;
         break;
      case 'USER':
         if (['ADMIN', 'SUPER_ADMIN'].includes(userAccessRole.code)) {
            status.isAuthorized = false;
            break;
         }
         console.log(
            "Authorized because logged in user is a USER and he's trying to operate on a 'USER'"
         );
         status.isAuthorized = true;
         break;
      default:
         break;
   }
   return status;
}
