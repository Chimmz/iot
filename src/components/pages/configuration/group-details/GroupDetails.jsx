import React, { useState, useEffect, useContext } from 'react';

import API from '../../../../utils/apiUtils';
import { configurationContext } from '../../../../contexts/configurationContext';

import Spinner from 'react-bootstrap/Spinner';
import './GroupDetails.scss';

function GroupDetails({ show, groupId, userToken }) {
   const { allGroupDetails, setAllGroupDetails, fetchGroupDetails } =
      useContext(configurationContext);

   useEffect(() => {
      if (!show || allGroupDetails[groupId]) return;
      fetchGroupDetails(groupId, userToken);
   }, [show]);

   const details = allGroupDetails[groupId];
   const membersCount =
      details?.users?.length +
      (details?.users?.length == 1 ? ' member' : ' members');

   return (
      <div
         className={`card px-4 py-4 group-details fade ${show && 'show'}`}
         id={groupId}
      >
         {details ? (
            <>
               <h4 className="mb-2">
                  {details?.group?.name} ({membersCount})
               </h4>
               <hr style={{ background: '#bbbbbb' }} />
               <ul className="group-members mt-2">
                  {details?.users?.map(u => (
                     <li key={u.userId}>{u.firstName + ' ' + u.lastName}</li>
                  ))}
               </ul>
            </>
         ) : (
            <Spinner animation="border" size="sm" />
         )}
      </div>
   );
}

export default GroupDetails;
