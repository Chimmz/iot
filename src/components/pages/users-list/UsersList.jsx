import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as userSelectors from '../../../redux/user/user-selectors';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';

import useFetch from '../../../hooks/useFetch';
import { useUsersListContext } from '../../../contexts/usersListContext';

import API from '../../../utils/apiUtils';
import { tableColumns } from './table-config';

import IotTable from '../../iot-table/IotTable';
import UserActions from './actions-on-user/UserActions';
import PageHeader from '../../page-header/PageHeader';
import Spinner from '../../UI/spinner/Spinner';
import Toggler from '../../UI/toggler/Toggler';
import ToggleUser from './toggle-user/ToggleUser';
import AddNewUser from './add-new-user/AddNewUser';

function UsersList({ currentPortfolio, userToken }) {
   const [users, setUsers] = useState([]);
   const [usersInPortfolio, setUsersInPortfolio] = useState([]);
   const { sendRequest: sendManyRequests, loading: manyRequestsLoading } =
      useFetch();

   // To track when the user list gets updated by either adding/deleting/updating a user
   const { wasUpdated, setWasUpdated } = useUsersListContext();

   const getTableData = function () {
      if (!users.length) return [];

      return users.map(u => ({
         userName: u.firstName + ' ' + u.lastName,
         propertyName: u.portfolioName,
         phone: u.contactNumber,
         group: u.roles?.find(role => role.roleType == 'VIEW')?.name,
         primaryEmail: u.emailId,
         action: (
            <UserActions
               user={u}
               usersInPortfolio={usersInPortfolio}
               userToken={userToken}
            />
         ),
         active: <ToggleUser user={u} userToken={userToken} />
      }));
   };

   const loadUsers = async function () {
      try {
         const responses = await sendManyRequests(
            Promise.all([
               API.getUsersList(userToken),
               API.getAllUsersInPortfolio(
                  currentPortfolio.portfolioHeaderId,
                  userToken
               )
            ])
         );
         [setUsers, setUsersInPortfolio].forEach((set, i) => set(responses[i]));
      } catch (err) {
         console.log(err);
      }
   };

   useEffect(() => {
      loadUsers();
   }, []);

   useEffect(() => {
      if (wasUpdated) loadUsers(); // If the user list was updated
      setWasUpdated(false);
   }, [wasUpdated]);

   return (
      <>
         <PageHeader location={useLocation()} />
         <Routes>
            <Route path='new-user' element={<AddNewUser />} />
         </Routes>
         <div className='card px-3 py-5 flex-grow data-card telemetry'>
            <div className='d-flex justify-content-space-between'>
               <h2 className='page-heading fw-600 mb-lg flex-grow'>
                  Users List
               </h2>
               <Link to='new-user' className='btn btn-primary ' type='submit'>
                  Add new user
               </Link>
            </div>
            <IotTable columns={tableColumns} data={getTableData()} />
         </div>
         <Spinner show={manyRequestsLoading} msg='Getting records...' />
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   userToken: userSelectors.selectUserToken,
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio
});

export default connect(mapStateToProps)(UsersList);
