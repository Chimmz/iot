import React from 'react';

import { getFullName } from '../../../../redux/user/user-utils';
import Spinner from 'react-bootstrap/Spinner';
import './GroupDetails.scss';

function GroupDetails({ show, details, detailsLoading }) {
   const membersCount =
      details?.users.length +
      (details?.users.length == 1 ? ' member' : ' members');

   return (
      <div
         className={`card px-4 py-4 group-details fade ${show && 'show'}`}
         id={details?.group.groupId}
      >
         {detailsLoading ? (
            <Spinner animation="border" size="sm" />
         ) : (
            <>
               <h4 className="mb-2">
                  {details?.group?.name} ({membersCount})
               </h4>
               <hr style={{ background: '#bbbbbb' }} />
               <ul className="group-members mt-2">
                  {details?.users?.map(u => (
                     <li key={u.userId}>{getFullName.call(u)}</li>
                  ))}
               </ul>
            </>
         )}
      </div>
   );
}

export default GroupDetails;
