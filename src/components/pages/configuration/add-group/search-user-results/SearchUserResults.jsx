import React from 'react';
import useSimpleSearch from '../../../../../hooks/useSimpleSearch';
import * as userUtils from '../../../../../redux/user/user-utils';

function SearchUserResults({ query, users, addedUsers, onSelectResult }) {
   const [searchUserResults] = useSimpleSearch({
      query,
      items: users,
      criteria: user =>
         userUtils.getFullName(user).toLowerCase().includes(query.toLowerCase())
   });

   const usersToDisplay = query ? searchUserResults : users;

   return usersToDisplay?.map(user => (
      <div className='search-result d-flex' key={user.userId}>
         <input
            type='checkbox'
            id={user.userId}
            checked={addedUsers.includes(user.userId)}
            onChange={ev => onSelectResult(user, ev)}
         />
         <label htmlFor={user.userId} className='result-name'>
            {userUtils.getFullName(user)}
         </label>
      </div>
   ));
}

export default SearchUserResults;
