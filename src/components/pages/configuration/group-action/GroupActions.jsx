import React, { useState, useEffect, useContext } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userSelectors from '../../../../redux/user/user-selectors';

import { configurationContext } from '../../../../contexts/configurationContext';
import useToggle from '../../../../hooks/useToggle';
import useFetch from '../../../../hooks/useFetch';

import API from '../../../../utils/apiUtils';

import GroupDetails from '../group-details/GroupDetails';
import DeleteConfirmation from '../../../UI/delete-confirmation/DeleteConfirmation';

import { Trash3, ThreeDotsVertical } from 'react-bootstrap-icons';
import './GroupActions.scss';

function GroupActions({ group: { groupId }, currentUser, userToken }) {
   const [groupDetailsShown, toggleShowGroupDetails, _, hideGroupDetails] =
      useToggle(false);
   const { sendRequest: sendDeleteRequest, loading: deleteRequestLoading } =
      useFetch();

   const { setGroupsUpdated } = useContext(configurationContext);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

   useEffect(() => {
      const manageShowGroupDetails = ({ target }) => {
         if (target.viewBox && target.id === groupId)
            return toggleShowGroupDetails();

         if (
            groupDetailsShown &&
            target.id != groupId &&
            !target.classList.contains('group-details') &&
            !target.parentElement.classList.contains('group-details')
         )
            return hideGroupDetails();
      };

      document.body.addEventListener('click', manageShowGroupDetails);

      return () =>
         document.body.removeEventListener('click', manageShowGroupDetails);
   }, [groupDetailsShown]);

   const deleteGroup = async function () {
      console.log(+groupId, currentUser.userId, userToken);
      try {
         const res = await sendDeleteRequest(
            API.deleteGroup(+groupId, currentUser.userId, userToken)
         );
         setGroupsUpdated(true);
         console.log(res);
      } catch (err) {
         console.log(err);
      }
   };

   return (
      <div
         className="group-actions d-flex justify-content-center align-items-center"
         style={{ gap: '17px', border: '1px solid red !important' }}
      >
         {/* The Delete icon */}
         <Trash3
            style={{ cursor: 'pointer', title: 'Delete group' }}
            onClick={() => setShowDeleteConfirm(true)}
         />

         {/* The 3 dots toggle */}
         <ThreeDotsVertical
            onClick={toggleShowGroupDetails}
            style={{ cursor: 'pointer', title: 'Show group details' }}
            id={groupId}
         />

         {/* The box showing list of users in the group */}
         <GroupDetails
            groupId={groupId}
            userToken={userToken}
            show={groupDetailsShown}
         />

         {/* The Delete confirm modal - not shown initially. See the 'show' prop on it */}
         <DeleteConfirmation
            show={showDeleteConfirm}
            onDelete={deleteGroup}
            onDeleteLoading={deleteRequestLoading}
            bodyText="Are you sure you want to permanently delete the selected row(s)?"
            close={() => setShowDeleteConfirm(false)}
         />
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(GroupActions);
