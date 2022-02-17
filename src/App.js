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
import Login from './components/pages/Login';
import Alerts from './components/alert/Alerts';
import Dashboard from './components/pages/Dashboard';
import ForgotPassword from './components/pages/ForgotPassword';
import ChangePassword from './components/pages/ChangePassword';
import EmailSuccess from './components/pages/EmailSuccess';
import ChangedPasswordSuccess from './components/pages/ChangedPasswordSuccess';

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

            <Route path='/forgot-password' element={<ForgotPassword />} />
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
