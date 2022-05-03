import React, { useEffect, useContext } from 'react';

import useToggle from '../../../../hooks/useToggle';
import API from '../../../../utils/apiUtils';

import { configurationContext } from '../../../../contexts/configurationContext';
import Toggler from '../../../UI/toggler/Toggler';

import Spinner from 'react-bootstrap/Spinner';
import useFetch from '../../../../hooks/useFetch';

function GroupToggle({ groupId, userToken }) {
   const { allGroupDetails } = useContext(configurationContext);
   const [turnedOn, toggle, _, __, setToggleState] = useToggle(false);

   const {
      sendRequest: sendGroupDetailsRequest,
      loading: requestGroupDetailsLoading
   } = useFetch();

   const { sendRequest: sendToggleRequest, loading: requestToggleLoading } =
      useFetch();

   const toggleStatus = async () => {
      sendToggleRequest(API.toggleGroupStatus(groupId, userToken))
         .then(res => res == 1 && toggle())
         .catch(console.log);
   };

   const getCurrentToggleStatus = async () => {
      const groupDetails =
         allGroupDetails[groupId] ||
         (await sendGroupDetailsRequest(
            API.getGroupDetails(groupId, userToken)
         ));
      const toggleStatus = { 1: true, 2: false };
      return toggleStatus[groupDetails?.group?.groupStatusId] || false;
   };

   useEffect(async () => {
      const initialToggleState = await getCurrentToggleStatus();
      setToggleState(initialToggleState);
   }, []);

   return (
      <div className='d-flex align-items-center' style={{ gap: '5px' }}>
         <Toggler isOn={turnedOn} onSwitch={toggleStatus} id={groupId} />
         {requestToggleLoading && <Spinner animation='border' size='sm' />}
      </div>
   );
}

export default GroupToggle;
