// export const getRoleOptions = roles => {
//    if (!roles?.length) return [];
//    const roleOptions = roles.map(role => ({ label: role.name, value: role }));
//    return roleOptions;
// };

// export const getRestrictedRoleOptions = (...params) => {
//    console.log(...params);
//    const [userRole, loggedInUserRole, allRoles] = params;
//    const roleOptions = [];

//    switch (loggedInUserRole.code) {
//       case 'SUPER_ADMIN':
//          roleOptions.push(...allRoles);
//          break;

//       case 'ADMIN':
//          let options =
//             userRole.code === 'SUPER_ADMIN'
//                ? ['SUPER_ADMIN']
//                : ['ADMIN', 'USER'];

//          roleOptions.push(
//             ...allRoles.filter(role => options.includes(role.code))
//          );
//          break;

//       case 'USER':
//          options = [userRole.code];
//          // if (userRole.code === 'ADMIN') options = ['ADMIN'];
//          // else if (userRole.code === 'SUPER_ADMIN') options = ['SUPER_ADMIN'];
//          // else if (userRole.code === 'USER') options = ['USER']

//          roleOptions.push(
//             ...allRoles.filter(role => options.includes(role.code))
//          );
//          break;

//       default:
//          break;
//    }
//    return roleOptions;
// };
