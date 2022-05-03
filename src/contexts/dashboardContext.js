import React, { useState, createContext } from 'react';
import useToggle from '../hooks/useToggle';

export const dashboardContext = createContext();

export const DashboardContextProvider = props => {
   const [telemetryData, setTelemetryData] = useState({ incidents: [] });
   const [sidebarCollapsed, toggleSidebarCollapsed, showSidebar, hideSidebar] =
      useToggle(false);
   const [dashboardLinkActive, setDashboardLinkActive] = useState(false);
   const [notifLinkActive, setNotifLinkActive] = useState(false);

   return (
      <dashboardContext.Provider
         value={{
            sidebarCollapsed,
            toggleSidebarCollapsed,
            showSidebar,
            hideSidebar,
            dashboardLinkActive,
            setDashboardLinkActive,
            notifLinkActive,
            setNotifLinkActive
         }}
      >
         {props.children}
      </dashboardContext.Provider>
   );
};
