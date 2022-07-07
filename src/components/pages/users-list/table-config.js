import * as userUtils from '../../../redux/user/user-utils';
import UserActions from './actions-on-user/UserActions';
import ToggleUser from './toggle-user/ToggleUser';
import { toCamelCase, toTitleCase } from '../../../utils/stringUtils';

const tableFields = [
   'user name',
   'property name',
   'primary email',
   'phone',
   'role',
   'active',
   'action',
];

export const getTableData = function ({ usersInPortfolio }) {
   if (!usersInPortfolio?.length) return [];

   return usersInPortfolio.map(u => ({
      userName: userUtils.getFullName.call(u),
      propertyName: u.portfolioName,
      phone: u.contactNumber,
      role: userUtils.getUserAccessRole.call(u)?.name,
      primaryEmail: u.emailId,
      action: <UserActions user={u} />,
      active: u,
   }));
};

const customRenderHandlers = {
   // Has to be function declaration style because of 'this'
   active: function (value) {
      const user = value;
      const { setUsersInPortfolio } = this;

      const updateUserStatusInList = (userId, newStatusId) => {
         const statusMap = {
            1: { statusCode: 'ACTIVE', userStatusId: 1, status: 'Active' },
            2: { statusCode: 'INACTIVE', userStatusId: 2, status: 'InActive' },
         };
         setUsersInPortfolio(users => {
            return users.map(u =>
               +u.userId === +userId ? { ...u, ...statusMap[newStatusId] } : u
            );
         });
      };
      return (
         <>
            <span className="d-none">{user.userStatusId}</span>
            <ToggleUser
               key={user.userId}
               user={user}
               updateUserStatusInList={updateUserStatusInList}
            />
         </>
      );
   },

   'primary email': (value, record) => (
      <>
         <span className="d-none">{value}</span>
         <div>{value}</div>
      </>
   ),
};

export const getTableColumns = function () {
   const { setUsersInPortfolio } = this;

   return tableFields.map(field => {
      const column = { name: toCamelCase(field), label: toTitleCase(field) };

      switch (field) {
         case 'active':
         case 'primary email':
            column.options = {
               customCellRender: customRenderHandlers[field].bind({
                  setUsersInPortfolio,
               }),
            };
            break;
         default:
            break;
      }
      return column;
   });
};
