import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userCreators from '../../../redux/user/user-action-creators';
import * as userSelectors from '../../../redux/user/user-selectors';

// Boostrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import API from '../../../utils/api';

import Modal from '../../UI/Modal';
import './Dashboard.scss';
import * as asyncUtils from '../../../utils/asyncUtils';

function Dashboard(props) {
   const { currentUser, userStatusMsg, userToken, dispatch } = props;
   const [termsModalShown, setTermsModalShown] = useState(
      !currentUser.isAccepted
   );

   // const getLegalUser = async () => {
   //    try {
   //       const res = await asyncUtils.getResponseWithinTimeout(
   //          API.getLegalUser(currentUser.userId, userToken)
   //       );
   //       if (res.legal === null) {
   //       }
   //       console.log(res);
   //    } catch (err) {
   //       console.log(err);
   //    }
   // };

   // useEffect(() => getLegalUser(), []);

   const handleClickLogout = () => dispatch(userCreators.logout());

   if (userStatusMsg === 'DEFAULT_PASSWORD')
      return <Navigate to='/change-password' />;

   return (
      <>
         {/* <Modal show-if={termsModalShown} /> */}
         <h1>
            Hi {currentUser.firstName} {currentUser.lastName}
         </h1>
         <button onClick={handleClickLogout}>Logout</button>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   userStatusMsg: userSelectors.selectUserStatusMsg,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(Dashboard);
