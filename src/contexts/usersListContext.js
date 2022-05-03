import { useState, useContext, createContext } from 'react';

export const usersListContext = createContext();

export function UsersListContextProvider(props) {
   // To track when the user list gets updated by either adding/deleting/updating a user
   const [wasUpdated, setWasUpdated] = useState(false);

   return (
      <usersListContext.Provider value={{ wasUpdated, setWasUpdated }}>
         {props.children}
      </usersListContext.Provider>
   );
}

export const useUsersListContext = () => useContext(usersListContext);
