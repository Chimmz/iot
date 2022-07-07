import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';
import * as notifCreators from '../../../../redux/notification/notification-action-creators';

// HOOKS
import useToggle from '../../../../hooks/useToggle'; // To control toggle states
import useFetch from '../../../../hooks/useFetch'; // To control API fetches
import { configurationContext } from '../../../../contexts/configurationContext';

import API from '../../../../utils/apiUtils';

import GroupDetails from '../group-details/GroupDetails';
import DeleteConfirmation from '../../../UI/delete-confirmation/DeleteConfirmation';
import EditGroup from '../edit-group/EditGroup';

import Spinner from 'react-bootstrap/Spinner';
import { Trash3, ThreeDotsVertical, PencilSquare } from 'react-bootstrap-icons';
import './GroupActions.scss';

function GroupActions({ group: { groupId }, ...otherProps }) {
   const { currentUser, currentPortfolio, userToken, dispatch } = otherProps;
   const navigate = useNavigate();

   const [groupDetails, setGroupDetails] = useState(null);
   const [showGroupInfo, setShowGroupInfo] = useState(false);
   const [groupDetailsShown, toggleShowGroupDetails, _, hideGroupDetails] =
      useToggle(false);

   const { sendRequest: sendDeleteRequest, loading: deleteRequestLoading } =
      useFetch();

   const {
      sendRequest: sendGroupDetailsRequest,
      loading: groupDetailsLoading,
   } = useFetch();

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

   const getGroupDetails = function () {
      if (groupDetails || groupDetailsLoading) return; // If groupDetails already fetched or is fetching

      const req = sendGroupDetailsRequest(
         API.getGroupDetails(groupId, userToken)
      );
      req.then(setGroupDetails).catch(console.log);
   };

   const deleteGroup = async function () {
      const req = sendDeleteRequest(
         API.deleteGroup(+groupId, currentUser.userId, userToken)
      );
      req.then(res => {
         console.log(res);
         dispatch(notifCreators.loadNewNotifs(currentPortfolio, userToken));
         setGroupsUpdated(true);
      });
      req.catch(console.log);
   };

   return (
      <div
         className="group-actions d-flex justify-content-center align-items-center"
         style={{ gap: '17px', border: '1px solid red !important' }}
         onMouseEnter={getGroupDetails}
      >
         {/* The Delete icon */}
         <Trash3
            style={{ cursor: 'pointer' }}
            title="Delete group"
            onClick={() => setShowDeleteConfirm(true)}
         />

         {/* The Edit icon */}
         <PencilSquare
            style={{ cursor: 'pointer', color: '#000' }}
            title="Edit group"
            onClick={() => setShowGroupInfo(true)}
         />

         {/* The 3 dots toggle */}
         <ThreeDotsVertical
            onClick={toggleShowGroupDetails}
            style={{ cursor: 'pointer' }}
            title="Show group details"
            id={groupId}
         />

         {/* The box showing list of users in the group */}
         <GroupDetails
            details={groupDetails}
            detailsLoading={groupDetailsLoading}
            show={groupDetailsShown}
         />

         {/* The Delete confirm modal - not shown initially. See its 'show' prop */}
         <DeleteConfirmation
            show={showDeleteConfirm}
            deleteAction={deleteGroup}
            isDeleting={deleteRequestLoading}
            confirmMsg="Are you sure you want to permanently delete the selected row(s)?"
            close={() => setShowDeleteConfirm(false)}
         />
         {groupDetails && showGroupInfo ? (
            <EditGroup
               groupDetailsLoading={groupDetailsLoading}
               groupDetails={groupDetails}
               show={showGroupInfo}
               close={() => setShowGroupInfo(false)}
            />
         ) : (
            <></>
         )}
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   userToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(GroupActions);
