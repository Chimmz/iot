import React, { useEffect, useContext } from 'react';

import useToggle from '../../../../hooks/useToggle';
import API from '../../../../utils/apiUtils';

import Toggler from '../../../UI/toggler/Toggler';
import Spinner from 'react-bootstrap/Spinner';
import useFetch from '../../../../hooks/useFetch';

function GroupToggle({ group, userToken }) {
   const [isActive, toggleIsActive] = useToggle(
      group.groupStatusCode === 'ACTIVE'
   );
   const { sendRequest: sendToggleRequest, loading: requestToggleLoading } =
      useFetch();

   const toggleUserStatus = function () {
      const req = sendToggleRequest(
         API.toggleGroupStatus(group.groupId, userToken)
      );
      req.then(res => res == 1 && toggleIsActive());
      req.catch(console.log);
   };

   return (
      <div className="d-flex align-items-center" style={{ gap: '5px' }}>
         <Toggler
            isOn={isActive}
            onSwitch={toggleUserStatus}
            id={group.groupId}
         />
         {requestToggleLoading && <Spinner animation="border" size="sm" />}
      </div>
   );
}

export default GroupToggle;
