import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userSelectors from '../../../../redux/user/user-selectors';

import { ConfigurationContextProvider } from '../../../../contexts/configurationContext';
import { UsersListContextProvider } from '../../../../contexts/usersListContext';

// Imports of Subpages
import DashboardHome from '../../dashboard-home/DashboardHome';
import Hightlights from '../../dashboard-home/DashboardHighlights';
import Insights from '../../dashboard-home/DashboardInsights';

import IotDevices from '../../iot-devices/IotDevices';
import Telemetry from '../../telemetry/Telemetry';
import Notifs from '../../notifications/Notifs';
import Configuration from '../../configuration/Configuration';
import UsersList from '../../users-list/UsersList';

import Footer from '../../../layout/Footer';
import './DashboardPages.scss';

function DashboardPages({ userRoles, userViewRole }) {
   const isAdminOrSuperAdmin = userRoles.some(role =>
      ['ADMIN', 'SUPER_ADMIN'].includes(role.code)
   );
   const isUserManager = userViewRole?.name.toLowerCase() === 'manager';

   return (
      <div className="page__content col thin-scrollbar">
         <Routes>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="highlights" element={<Hightlights />} />
            <Route
               path="insights"
               element={isUserManager ? <Insights /> : <Navigate to="/" />}
            />

            <Route path="devices" element={<IotDevices />} />
            <Route path="telemetry" element={<Telemetry />} />
            <Route path="notifications" element={<Notifs />} />

            <Route
               path="admin-panel/configuration/*"
               element={
                  isAdminOrSuperAdmin ? (
                     <ConfigurationContextProvider>
                        <Configuration />
                     </ConfigurationContextProvider>
                  ) : (
                     <Navigate to="/" />
                  )
               }
            />

            <Route
               path="admin-panel/users-list/*"
               element={
                  isAdminOrSuperAdmin ? (
                     <UsersListContextProvider>
                        <UsersList />
                     </UsersListContextProvider>
                  ) : (
                     <Navigate to="/" />
                  )
               }
            />
         </Routes>
         <Footer />
      </div>
   );
}

const mapStateToProps = createStructuredSelector({
   userRoles: userSelectors.selectCurrentUserRoles,
   userViewRole: userSelectors.selectUserViewRole
});

export default connect(mapStateToProps)(DashboardPages);
