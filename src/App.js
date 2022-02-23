import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Standard Redux imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
   selectUserAccepted,
   selectUserLoggedIn
} from './redux/user/user-selectors';

// External components
import Login from './components/pages/auth/login/Login';
import Alerts from './components/alert/Alerts';
import Dashboard from './components/pages/dashboard/Dashboard';
import PasswordReset from './components/pages/auth/password-reset/PasswordReset';
import ChangePassword from './components/pages/auth/change-password/ChangePassword';
import EmailSuccess from './components/pages/auth/password-reset/success/EmailSuccess';
import ChangedPasswordSuccess from './components/pages/auth/change-password/success/ChangedPasswordSuccess';

import './App.scss';

function App({ loggedIn, userAcceptedTermsAndCond }) {
   console.log('loggedIn: ', loggedIn);
   console.log('userAccepted: ', userAcceptedTermsAndCond);
   return (
      <>
         <Alerts />
         <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Navigate replace to='/dashboard' />} />

            <Route
               path='/dashboard'
               element={
                  loggedIn ? <Dashboard /> : <Navigate replace to='/login' />
               }
            />

            <Route
               path='/change-password'
               element={
                  loggedIn ? (
                     <ChangePassword />
                  ) : (
                     <Navigate replace to='/login' />
                  )
               }
            />
            <Route
               path='/change-password/success'
               element={
                  loggedIn ? (
                     <ChangedPasswordSuccess />
                  ) : (
                     <Navigate replace to='/login' />
                  )
               }
            />

            <Route path='/forgot-password' element={<PasswordReset />} />
            <Route path='/email-success' element={<EmailSuccess />} />
         </Routes>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   loggedIn: selectUserLoggedIn,
   userAcceptedTermsAndCond: selectUserAccepted
});

export default connect(mapStateToProps)(App);
