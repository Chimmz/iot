import React, { useState } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../../redux/user/user-selectors';
import * as notifCreators from '../../../../redux/notification/notification-action-creators';

import useFetch from '../../../../hooks/useFetch';
import { useUsersListContext } from '../../../../contexts/usersListContext';

import API from '../../../../utils/apiUtils';
import {
   getFullName,
   restrictOperation,
} from '../../../../redux/user/user-utils';

import { Trash3, ThreeDotsVertical } from 'react-bootstrap-icons';
import DeleteConfirmation from '../../../UI/delete-confirmation/DeleteConfirmation';
import ErrorModal from '../../../UI/error-modal/ErrorModal';
import UserInfo from '../user-info/UserInfo';

const AUTH_DELETE_ERROR_TITLE = 'Unauthorized';
const AUTH_DELETE_ERROR_MSG = 'You are not allowed to delete this user';

function UserActions(props) {
   const { currentUser, currentPortfolio, dispatch } = props;
   const { user: userInRow, userToken: adminUserToken } = props;

   const { setWasUpdated } = useUsersListContext();
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [showUserInfo, setShowUserInfo] = useState(false);
   const { sendRequest: sendDeleteRequest, loading: deleteRequestsLoading } =
      useFetch();
   const [showAuthError, setShowAuthError] = useState(false);
   const { isAuthorized } = restrictOperation.call(currentUser, userInRow);
   console.log('isAuthorized: ', isAuthorized);

   const deleteUser = () => {
      const req = sendDeleteRequest(
         API.deleteUser(userInRow.userId, currentUser.userId, adminUserToken)
      );
      req.then(res => {
         // if (!res) return // Handle errors here
         console.log(res);
         dispatch(
            notifCreators.loadNewNotifs(currentPortfolio, adminUserToken)
         );
         setShowDeleteConfirm(false);
         setWasUpdated(true);
      });
      req.catch(console.log);
      return req;
   };

   const userName = getFullName.call(userInRow);
   return (
      <div
         className="group-actions d-flex justify-content-center align-items-center"
         style={{ gap: '17px' }}
      >
         {/* The Delete icon */}
         <Trash3
            style={{ cursor: 'pointer', title: 'Delete group' }}
            onClick={
               !isAuthorized
                  ? () => setShowAuthError(true)
                  : () => setShowDeleteConfirm(true)
            }
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
               isAuthorizedToEdit={isAuthorized}
               close={() => setShowUserInfo(false)}
            />
         )}

         {showAuthError && (
            <ErrorModal
               show={showAuthError}
               close={() => setShowAuthError(false)}
               errorTitle={AUTH_DELETE_ERROR_TITLE}
               errorMsg={AUTH_DELETE_ERROR_MSG}
            />
         )}

         {/* The Delete confirm modal - not shown initially. See the 'show' prop on it */}
         <DeleteConfirmation
            show={showDeleteConfirm}
            deleteAction={deleteUser}
            isDeleting={deleteRequestsLoading}
            confirmMsg={`Are you sure you want to permanently delete ${userName}?`}
            close={() => setShowDeleteConfirm(false)}
         />
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   currentUser: userSelectors.selectCurrentUser,
   userToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(UserActions);
