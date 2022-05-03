import React from 'react';
import useFetch from '../../../../hooks/useFetch';
import Toggler from '../../../UI/toggler/Toggler';

import API from '../../../../utils/apiUtils';

import Spinner from 'react-bootstrap/Spinner';
import useToggle from '../../../../hooks/useToggle';

function ToggleUser({ user: userInRow, userToken: adminUserToken }) {
   const currentStatus = userInRow.status.toLowerCase() === 'active';
   const [isActive, toggleIsActive] = useToggle(currentStatus);

   const { sendRequest: sendUserToggleRequest, loading: requestToggleLoading } =
      useFetch();

   const toggleStatus = async function () {
      const req = sendUserToggleRequest(
         API.toggleUserStatus(userInRow.userId, adminUserToken)
      );
      req.then(res => res == 1 && toggleIsActive());
   };

   return (
      <div className='d-flex align-items-center' style={{ gap: '5px' }}>
         <Toggler
            isOn={isActive}
            onSwitch={toggleStatus}
            id={userInRow.userId}
         />
         {requestToggleLoading && <Spinner animation='border' size='sm' />}
      </div>
   );
}

export default ToggleUser;
