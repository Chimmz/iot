export const getRoleOptions = roles => {
   if (!roles?.length) return [];
   const roleOptions = roles.map(role => ({ label: role.name, value: role }));
   return roleOptions;
};
