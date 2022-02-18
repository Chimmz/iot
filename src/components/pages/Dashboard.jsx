import React from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userCreators from '../../redux/user/user-action-creators';
import {
   selectUserStatusMsg,
   selectCurrentUser
} from '../../redux/user/user-selectors';

// Boostrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import './Dashboard.scss';

function Dashboard({ currentUser, userStatusMsg, dispatch }) {
   const handleClickLogoutBtn = () => dispatch(userCreators.logout());

   if (userStatusMsg === 'DEFAULT_PASSWORD')
      return <Navigate to='/change-password' />;

   return (
      <>
         <h1>
            Hi {currentUser.firstName} {currentUser.lastName}
         </h1>
         <button onClick={handleClickLogoutBtn}>Logout</button>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: selectCurrentUser,
   userStatusMsg: selectUserStatusMsg
});

export default connect(mapStateToProps)(Dashboard);
