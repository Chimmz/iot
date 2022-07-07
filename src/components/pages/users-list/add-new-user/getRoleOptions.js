const getRoleOptions = (loggedInUserRole, allRoles) => {
   const roleOptions = {
      SUPER_ADMIN: allRoles,
      ADMIN: allRoles.filter(role => ['ADMIN', 'USER'].includes(role.code)),
      USER: allRoles.filter(role => ['USER'].includes(role.code)),
   };
   return roleOptions[loggedInUserRole.code];
};

export default getRoleOptions;
