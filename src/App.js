import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
// Standard Redux imports
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// Redux state selectors and actions
import * as userSelectors from './redux/user/user-selectors';
import * as portfolioSelectors from './redux/portfolio/portfolio-selectors';
import * as notificationActions from './redux/notification/notifications-actions';
// Utils
import * as dateUtils from './utils/dateUtils';
import API from './utils/apiUtils';
// Hooks
import useFetch from './hooks/useFetch';
// External components
import Login from './components/pages/auth/login/Login';
import Alerts from './components/alert/Alerts';
import Dashboard from './components/pages/dashboard/Dashboard';
import PasswordReset from './components/pages/auth/password-reset/PasswordReset';
import ChangePassword from './components/pages/auth/change-password/ChangePassword';
import ChangedPasswordSuccess from './components/pages/auth/change-password/success/ChangedPasswordSuccess';
import TelemetryIncidentPage from './components/pages/incident-form/IncidentFormPage';
import IncidentFormSuccess from './components/pages/incident-form/success/IncidentFormSuccess';
import IncidentUpdate from './components/IncidentUpdate';
import IncidentSupress from './components/IncidentSupress';
import IncidentActionSuccess from './components/IncidentActionSuccess';
import PrivacyPolicy from './components/pages/privacy-policy/PrivacyPolicy';
// Contexts and context providers
import { DashboardContextProvider } from './contexts/dashboardContext';
import { IncidentFormContextProvider } from './contexts/incidentFormContext';
import './App.scss';

function App({ loggedIn, userToken, currentPortfolio, dispatch }) {
   console.log('loggedIn: ', loggedIn);
   const { sendRequest: sendGetNotifsRequest } = useFetch();

   const checkForNewNotifs = function () {
      const [fromDate, toDate] = dateUtils.getDateRangeBasedOnPeriod('1-day');
      const req = sendGetNotifsRequest(
         API.getNotifications(
            userToken,
            currentPortfolio.portfolioHeaderId,
            dateUtils.getDateOnly(fromDate),
            dateUtils.getDateOnly(toDate)
         )
      );
      req.then(latestNotifs => {
         const unreadNotifs = latestNotifs?.filter(notif => !notif.isRead);
         console.log('UNREAD: ', unreadNotifs);
         unreadNotifs?.length &&
            dispatch({
               type: notificationActions.SET_UNREAD_NOTIFICATIONS,
               payload: { notifs: unreadNotifs.reverse() }, // .reverse() to show most recent notifs first
            });
      });
   };

   useEffect(() => {
      if (!currentPortfolio) return;
      const EVERY_ONE_MINUTE = 60000;
      checkForNewNotifs();

      const notifInterval = setInterval(checkForNewNotifs, EVERY_ONE_MINUTE);
      return () => clearInterval(notifInterval);
   }, [currentPortfolio]);

   return (
      <>
         <Alerts />
         <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/" element={<Navigate replace to="/dashboard" />} />

            <Route
               path="/*"
               element={
                  <DashboardContextProvider>
                     <Dashboard />
                  </DashboardContextProvider>
               }
            />

            <Route
               path="/telemetry/incident-form"
               element={
                  loggedIn ? (
                     <IncidentFormContextProvider>
                        <TelemetryIncidentPage />
                     </IncidentFormContextProvider>
                  ) : (
                     <Navigate replace to="/login" />
                  )
               }
            />

            <Route
               path="change-password"
               element={
                  loggedIn ? (
                     <ChangePassword />
                  ) : (
                     <Navigate replace to="/login" />
                  )
               }
            />
            <Route
               path="change-password/success"
               element={<ChangedPasswordSuccess />}
            />

            <Route path="forgot-password" element={<PasswordReset />} />

            <Route path="/success" element={<IncidentFormSuccess />} />
            <Route path="/incident/update" element={<IncidentUpdate />} />
            <Route path="/incident/suppress" element={<IncidentSupress />} />
            <Route
               path="/incident/suppress-action"
               element={<IncidentActionSuccess />}
            />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
         </Routes>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   loggedIn: userSelectors.selectUserLoggedIn,
   userToken: userSelectors.selectUserToken,
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
});

export default connect(mapStateToProps)(App);
