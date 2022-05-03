import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Standard Redux imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Redux state selectors
import * as userSelectors from './redux/user/user-selectors';

// External components
import Login from './components/pages/auth/login/Login';
import Alerts from './components/alert/Alerts';
import Dashboard from './components/pages/dashboard/Dashboard';
import PasswordReset from './components/pages/auth/password-reset/PasswordReset';
import ChangePassword from './components/pages/auth/change-password/ChangePassword';
import ChangedPasswordSuccess from './components/pages/auth/change-password/success/ChangedPasswordSuccess';

import TelemetryIncidentPage from './components/pages/incident-form/IncidentFormPage';

// Contexts and context providers
import { DashboardContextProvider } from './contexts/dashboardContext';
import { IncidentFormContextProvider } from './contexts/incidentFormContext';
import IncidentFormSuccess from './components/pages/incident-form/success/IncidentFormSuccess';
import IncidentUpdate from './components/IncidentUpdate';
import './App.scss';

function App({ loggedIn }) {
   console.log('loggedIn: ', loggedIn);

   return (
      <>
         <Alerts />
         <Routes>
            <Route path='login' element={<Login />} />
            <Route path='/' element={<Navigate replace to='/dashboard' />} />

            <Route
               path='/*'
               element={
                  <DashboardContextProvider>
                     <Dashboard />
                  </DashboardContextProvider>
               }
            />

            <Route
               path='/telemetry/incident-form'
               element={
                  loggedIn ? (
                     <IncidentFormContextProvider>
                        <TelemetryIncidentPage />
                     </IncidentFormContextProvider>
                  ) : (
                     <Navigate replace to='/login' />
                  )
               }
            />

            <Route
               path='change-password'
               element={
                  loggedIn ? (
                     <ChangePassword />
                  ) : (
                     <Navigate replace to='/login' />
                  )
               }
            />
            <Route
               path='change-password/success'
               element={<ChangedPasswordSuccess />}
            />

            <Route path='forgot-password' element={<PasswordReset />} />

            <Route path='/success' element={<IncidentFormSuccess />} />
            <Route path='/incident/update' element={<IncidentUpdate />} />
         </Routes>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   loggedIn: userSelectors.selectUserLoggedIn
});

export default connect(mapStateToProps)(App);
