import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ConfigurationContextProvider } from '../../../../contexts/configurationContext';

// Imports of Subpages
import DashboardHome from '../../dashboard-home/DashboardHome';
import Hightlights from '../../dashboard-home/DashboardHighlights';
import IotDevices from '../../iot-devices/IotDevices';
import Telemetry from '../../telemetry/Telemetry';
import Notifs from '../../notifications/Notifs';
import AdminPanel from '../../admin-panel/AdminPanel';
import Configuration from '../../configuration/Configuration';
import UsersList from '../../users-list/UsersList';

import './DashboardPages.scss';
import { UsersListContextProvider } from '../../../../contexts/usersListContext';

function DashboardPages() {
   return (
      <div className='page__content col thin-scrollbar'>
         <Routes>
            <Route path='dashboard' element={<DashboardHome />} />
            <Route path='highlights' element={<Hightlights />} />
            <Route path='devices' element={<IotDevices />} />
            <Route path='telemetry' element={<Telemetry />} />
            <Route path='notifications' element={<Notifs />} />
            <Route
               path='admin-panel/configuration/*'
               element={
                  <ConfigurationContextProvider>
                     <Configuration />
                  </ConfigurationContextProvider>
               }
            />
            <Route
               path='admin-panel/users-list/*'
               element={
                  <UsersListContextProvider>
                     <UsersList />
                  </UsersListContextProvider>
               }
            />
         </Routes>

         <div className='copy__right'>
            © Copyright 2022 InsureTek | All Rights Reserved
         </div>
      </div>
   );
}

export default DashboardPages;
