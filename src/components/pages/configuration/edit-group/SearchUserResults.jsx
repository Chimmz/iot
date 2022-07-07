import React from 'react';

import * as userUtils from '../../../../redux/user/user-utils';
import useSimpleSearch from '../../../../hooks/useSimpleSearch';

function SearchUserResults(props) {
   const { query, users, addedUsers, onCheckResult } = props;
   const searchCriteria = user =>
      userUtils.getFullName
         .call(user)
         .toLowerCase()
         .includes(query.toLowerCase());

   const [searchUserResults] = useSimpleSearch({
      query,
      items: users,
      criteria: searchCriteria,
   });

   const usersToDisplay = query ? searchUserResults : users;

   if (!usersToDisplay?.length) return <></>;
   return usersToDisplay?.map(user => (
      <div className="search-result d-flex" key={user.userId}>
         <input
            type="checkbox"
            id={user.userId}
            checked={addedUsers.includes(user.userId)}
            onChange={ev => onCheckResult(user, ev)}
         />
         <label htmlFor={user.userId} className="result-name">
            {userUtils.getFullName.call(user)}
         </label>
      </div>
   ));
}

export default SearchUserResults;
