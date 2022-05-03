import React, { useState, createContext } from 'react';
import API from '../utils/apiUtils';

export const configurationContext = createContext();

export const ConfigurationContextProvider = props => {
   const [allGroupDetails, setAllGroupDetails] = useState({});
   const [groupsUpdated, setGroupsUpdated] = useState(false);

   const fetchGroupDetails = async (groupId, userToken) => {
      try {
         const res = await API.getGroupDetails(groupId, userToken);
         setAllGroupDetails(details => ({ ...details, [groupId]: res }));
         return res;
      } catch (err) {
         return err;
      }
   };

   return (
      <configurationContext.Provider
         value={{
            allGroupDetails,
            setAllGroupDetails,
            fetchGroupDetails,
            groupsUpdated,
            setGroupsUpdated
         }}
      >
         {props.children}
      </configurationContext.Provider>
   );
};
