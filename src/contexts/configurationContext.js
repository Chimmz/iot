import React, { useState, createContext, useContext } from 'react';
import useFetch from '../hooks/useFetch';
import API from '../utils/apiUtils';

export const configurationContext = createContext();

export const ConfigurationContextProvider = props => {
   const [allGroupDetails, setAllGroupDetails] = useState({});
   const [groupsUpdated, setGroupsUpdated] = useState(false);
   const { sendRequest: sendGroupDetailsRequest, groupDetailsLoading } =
      useFetch();

   const fetchGroupDetails = async (groupId, userToken) => {
      const req = sendGroupDetailsRequest(
         API.getGroupDetails(groupId, userToken)
      );
      req.then(res => {
         setAllGroupDetails(details => ({ ...details, [groupId]: res }));
      });
      req.catch(console.log);
   };

   return (
      <configurationContext.Provider
         value={{
            allGroupDetails,
            setAllGroupDetails,
            fetchGroupDetails,
            groupDetailsLoading,
            groupsUpdated,
            setGroupsUpdated
         }}
      >
         {props.children}
      </configurationContext.Provider>
   );
};

export const useConfigurationContext = () => useContext(configurationContext);