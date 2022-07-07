import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as userSelectors from '../../../redux/user/user-selectors';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';

import useFetch from '../../../hooks/useFetch';
import { useUsersListContext } from '../../../contexts/usersListContext';

import API from '../../../utils/apiUtils';

import { getTableColumns, getTableData } from './table-config';

import IotTable from '../../iot-table/IotTable';
import Spinner from '../../UI/spinner/Spinner';
import AddNewUser from './add-new-user/AddNewUser';

function UsersList(props) {
   const { currentUser, currentPortfolio, userToken } = props;
   const [users, setUsers] = useState([]);
   const [usersInPortfolio, setUsersInPortfolio] = useState([]);
   const { sendRequest: sendManyRequests, loading: manyRequestsLoading } =
      useFetch();
   // To track when the users list gets updated by adding/deleting/updating a user
   const { wasUpdated, setWasUpdated } = useUsersListContext();
   const btnAddUserRef = useRef();

   const loadUsers = useCallback(() => {
      // If page reloads and currentPortfolio is not yet set by Redux
      if (!currentPortfolio) return;
      const reqs = [
         API.getUsersList(userToken),
         API.getAllUsersInPortfolio(
            currentPortfolio.portfolioHeaderId,
            userToken
         ),
      ];
      const requests = sendManyRequests(Promise.all(reqs));
      requests.then(responses => {
         // console.log(responses)
         [setUsers, setUsersInPortfolio].forEach((set, i) => set(responses[i]));
         setWasUpdated(false);
      });
      requests.catch(console.log);
   }, [currentPortfolio]);

   // useEffect(() => {
   //    const btnAddUser = document.querySelector('.btnAddUser');
   //    btnAddUser.remove();
   //    // console.log(btnAddUser);
   //    // btnAddUser.classList.add('d-none');
   //    // document
   //    //    .querySelector('.euka-datatables .table-header')
   //    //    .appendChild(btnAddUser);
   //    // .insertAdjacentHTML('beforeend', btnAddUser);
   // }, [usersInPortfolio.length, currentPortfolio, wasUpdated]);

   useEffect(() => {
      loadUsers();
   }, [loadUsers, currentPortfolio]);

   useEffect(() => {
      if (wasUpdated) loadUsers(); // If the user list was updated
   }, [wasUpdated, setWasUpdated, loadUsers]);

   if (manyRequestsLoading)
      return <Spinner show messsage="Getting records..." />;
   return (
      <>
         <Routes>
            <Route path="new-user" element={<AddNewUser />} />
         </Routes>
         <div className="card px-3 py-5 flex-grow data-card">
            <div
               className="d-flex align-items-center justify-content-space-between flex-wrap"
               style={{ columnGap: '15px' }}
            >
               <h2
                  className="page-heading fw-600 mb-lg flex-grow"
                  style={{ minWidth: 'max-content' }}
               >
                  Users List
               </h2>

            </div>
            <div className="userList-table">
               <IotTable
                  columns={getTableColumns.call({ setUsersInPortfolio })}
                  data={getTableData({ props, usersInPortfolio })}
               // extraTableHeaderElements={[
               //    <div ref={btnAddUserRef}>
               //       <Link
               //          to="new-user"
               //          className="btn btn-primary "
               //          type="submit"
               //       >
               //          Add new user
               //       </Link>
               //    </div>,
               // ]}
               />
               <Link
                  to="new-user"
                  className="btn btn-primary btnAddUser"
                  type="submit"
               >
                  Add New User
               </Link>
            </div>
         </div>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentUser: userSelectors.selectCurrentUser,
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   userToken: userSelectors.selectUserToken,
});

export default connect(mapStateToProps)(UsersList);
