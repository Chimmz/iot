import React, { useState } from 'react';

import API from '../../../../utils/apiUtils';
import * as userUtils from '../../../../redux/user/user-utils';

import { useUsersListContext } from '../../../../contexts/usersListContext';

import UserInfo from '../user-info/UserInfo';
import { Trash3, ThreeDotsVertical } from 'react-bootstrap-icons';
import DeleteConfirmation from '../../../UI/delete-confirmation/DeleteConfirmation';

function UserActions({ user: userInRow, userToken: adminUserToken }) {
   const userName = userUtils.getFullName(userInRow);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [showUserInfo, setShowUserInfo] = useState(false);

   const { wasUpdated, setWasUpdated } = useUsersListContext();

   const deleteUser = () => {
      const request = API.deleteUser(userInRow.userId, adminUserToken);
      request.then(res => {
         // if (!res) return // Handle errors here
         setShowDeleteConfirm(false);
         setWasUpdated(true);
      });
      request.catch(console.log);
   };

   return (
      <div
         className='group-actions d-flex justify-content-center align-items-center'
         style={{ gap: '17px' }}>
         {/* The Delete icon */}
         <Trash3
            style={{ cursor: 'pointer', title: 'Delete group' }}
            onClick={() => setShowDeleteConfirm(true)}
         />

         {/* The 3 dots toggle */}
         <ThreeDotsVertical
            onClick={() => setShowUserInfo(true)}
            style={{ cursor: 'pointer', title: 'Show group details' }}
            // id={groupId}
         />

         {showUserInfo && (
            <UserInfo
               user={userInRow}
               userToken={adminUserToken}
               show={showUserInfo}
               close={() => setShowUserInfo(false)}
            />
         )}

         {/* The Delete confirm modal - not shown initially. See the 'show' prop on it */}
         <DeleteConfirmation
            show={showDeleteConfirm}
            onDelete={deleteUser}
            bodyText={`Are you sure you want to permanently delete ${userName} from this list?`}
            close={() => setShowDeleteConfirm(false)}
         />
      </div>
   );
}

export default UserActions;
