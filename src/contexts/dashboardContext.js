import React, { createContext, useContext } from 'react';
import useToggle from '../hooks/useToggle';

export const dashboardContext = createContext();

export const DashboardContextProvider = props => {
   const [sidebarCollapsed, toggleSidebarCollapsed, showSidebar, hideSidebar] =
      useToggle(false);

   return (
      <dashboardContext.Provider
         value={{
            sidebarCollapsed,
            toggleSidebarCollapsed,
            showSidebar,
            hideSidebar
         }}
      >
         {props.children}
      </dashboardContext.Provider>
   );
};

export const useDashboardContext = () => useContext(dashboardContext);