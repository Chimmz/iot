import React from 'react';
import { Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userCreators from '../../redux/user/user-action-creators';
import { selectUserStatusMsg } from '../../redux/user/user-selectors';

import './Dashboard.css';

function Dashboard({ dispatch, userStatusMsg }) {
   if (userStatusMsg === 'DEFAULT_PASSWORD')
      return <Navigate to='/change-password' />;

   const handleClickLogoutBtn = () => dispatch(userCreators.logout());

   return (
      <div>
         <h1>User Dashboard Page</h1>{' '}
         <button style={{ fontSize: '2rem' }} onClick={handleClickLogoutBtn}>
            Log out
         </button>
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   userStatusMsg: selectUserStatusMsg
});

export default connect(mapStateToProps)(Dashboard);
