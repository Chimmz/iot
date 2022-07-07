import React, { useState, useEffect } from 'react';
// Redux imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userSelectors from '../../../../redux/user/user-selectors';
// Hooks
import useFetch from '../../../../hooks/useFetch';
import useToggle from '../../../../hooks/useToggle';
// Utils
import API from '../../../../utils/apiUtils';
import { restrictOperation } from '../../../../redux/user/user-utils';
// Other components
import Toggler from '../../../UI/toggler/Toggler';
import Spinner from 'react-bootstrap/Spinner';
import ErrorModal from '../../../UI/error-modal/ErrorModal';

const AUTH_ERROR_TITLE = 'Unauthorized';
const AUTH_ERROR_MSG = "You are not allowed to toggle this user's status";
const [ACTIVE_STATUS_ID, INACTIVE_STATUS_ID] = [1, 2];

function ToggleUser(props) {
   const { user: userInRow, currentUser, loggedInUserToken } = props;
   const { sendRequest: sendUserToggleRequest, loading: requestToggleLoading } =
      useFetch();
   const [showAuthError, setShowAuthError] = useState(false);
   const [isActive, toggleIsActive] = useToggle(
      userInRow?.status.toLowerCase() === 'active'
   );

   useEffect(() => {
      props.updateUserStatusInList(
         userInRow.userId,
         isActive ? ACTIVE_STATUS_ID : INACTIVE_STATUS_ID
      );
   }, [isActive]);

   const toggleUserStatus = function () {
      if (!userInRow) return;

      const restrictToggle = restrictOperation.bind(currentUser, userInRow);
      const { isAuthorized } = restrictToggle();
      if (!isAuthorized) return setShowAuthError(true);

      const req = sendUserToggleRequest(
         API.toggleUserStatus(userInRow.userId, loggedInUserToken)
      );
      req.then(res => res == 1 && toggleIsActive());
   };

   return (
      <>
         <div className="d-flex align-items-center" style={{ gap: '5px' }}>
            <Toggler
               isOn={isActive}
               onSwitch={toggleUserStatus}
               id={userInRow.userId}
            />
            {requestToggleLoading && <Spinner animation="border" size="sm" />}
         </div>

         {showAuthError && (
            <ErrorModal
               show={showAuthError}
               errorTitle={AUTH_ERROR_TITLE}
               errorMsg={AUTH_ERROR_MSG}
               close={() => setShowAuthError(false)}
            />
         )}
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   loggedInUserToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(ToggleUser);
