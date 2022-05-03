import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, Routes, Route, Link } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import * as userSelectors from '../../../redux/user/user-selectors';

import { configurationContext } from '../../../contexts/configurationContext';
import useFetch from '../../../hooks/useFetch';

import {
   tableColumns,
   getTableData,
   tableOptions
} from '../configuration/table-config';
import API from '../../../utils/apiUtils';

import PageHeader from '../../page-header/PageHeader';
import IotTable from '../../iot-table/IotTable';
import AddGroup from './add-group/AddGroup';
import Spinner from '../../UI/spinner/Spinner';
import './Configuration.scss';

function Configuration({ currentUser, userToken }) {
   const [groups, setGroups] = useState([]);
   const [showAddGroup, setShowAddGroup] = useState(false);
   const { sendRequest: sendGroupsRequest, loading: groupsRequestLoading } =
      useFetch();
   const { groupsUpdated, setGroupsUpdated } = useContext(configurationContext);

   const getGroups = onFetch => {
      const res = sendGroupsRequest(API.groupsGetAll(userToken));
      res.then(setGroups);
      res.then(onFetch);
      res.catch(console.log);
   };

   useEffect(async () => {
      getGroups();
      document.querySelector('.selected-info')?.classList.add('d-none');
   }, []);

   useEffect(() => {
      if (!groupsUpdated) return;
      const onFetch = () => setGroupsUpdated(false);
      getGroups(onFetch);
   }, [groupsUpdated]);

   return (
      <>
         <PageHeader location={useLocation()} />
         <Routes>
            <Route
               path='add-group'
               element={
                  <AddGroup
                     show={showAddGroup}
                     close={() => setShowAddGroup(false)}
                  />
               }
            />
         </Routes>

         <div className='card px-3 py-4 flex-grow data-card'>
            <div className='addgGroup-headtitle d-sm-flex justify-content-start'>
               <h2 className='page-heading fw-600 mb-lg me-auto'>
                  Configuration
               </h2>
               <Link
                  to='add-group'
                  className='btn btn-primary addGroup-topbtn'
                  type='submit'
                  onClick={() => setShowAddGroup(true)}>
                  Add new user group
               </Link>
            </div>

            <IotTable
               columns={tableColumns}
               data={getTableData(groups, userToken)}
               options={tableOptions}
            />
         </div>
         <Spinner show={groupsRequestLoading} message='Getting records...' />
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   userToken: userSelectors.selectUserToken,
   currentUser: userSelectors.selectCurrentUser
});

export default connect(mapStateToProps)(Configuration);
