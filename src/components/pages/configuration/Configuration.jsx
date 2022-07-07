import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, Routes, Route, Link } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import * as userSelectors from '../../../redux/user/user-selectors';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';

import { configurationContext } from '../../../contexts/configurationContext';
import useFetch from '../../../hooks/useFetch';

import {
   tableColumns,
   getTableData,
   tableOptions,
} from '../configuration/table-config';
import API from '../../../utils/apiUtils';

import PageHeader from '../../page-header/PageHeader';
import IotTable from '../../iot-table/IotTable';
import AddGroup from './add-group/AddGroup';
import Spinner from '../../UI/spinner/Spinner';
import './Configuration.scss';

function Configuration({ userToken, currentPortfolio }) {
   const [groups, setGroups] = useState([]);
   const [showAddGroup, setShowAddGroup] = useState(false);
   const { sendRequest: sendGroupsRequest, loading: groupsRequestLoading } =
      useFetch();
   const { groupsUpdated, setGroupsUpdated } = useContext(configurationContext);

   const getGroups = useCallback(() => {
      // If page reloads and currentPortfolio is not yet set by Redux
      if (!currentPortfolio) return;
      // Fetch groups
      let req = sendGroupsRequest(
         API.GetAllGroupsByPortfolio(userToken, currentPortfolio)
      );
      req.then(groups => {
         console.log(groups);
         setGroups(groups);
         setGroupsUpdated(false);
      });
      req.catch(console.log);
   }, [currentPortfolio]);

   useEffect(() => {
      document.querySelector('.selected-info')?.classList.add('d-none');
   }, []);

   useEffect(() => {
      getGroups(); // Load groups from API
   }, [currentPortfolio]);

   useEffect(() => {
      // Reload groups when any group creation/update/delete is done
      if (groupsUpdated) getGroups();
   }, [groupsUpdated]);

   if (groupsRequestLoading)
      return <Spinner show message="Getting records..." />;
   return (
      <>
         <Routes>
            <Route
               path="add-group"
               element={
                  <AddGroup
                     show={showAddGroup}
                     close={() => setShowAddGroup(false)}
                  />
               }
            />
         </Routes>

         <div className="card px-3 py-4 flex-grow data-card group-config">
            <div className="addgGroup-headtitle d-sm-flex justify-content-start">
               <h2 className="page-heading fw-600 mb-lg me-auto">
                  Configuration
               </h2>
               <Link
                  to="add-group"
                  className="btn btn-primary addGroup-topbtn"
                  type="submit"
                  onClick={() => setShowAddGroup(true)}
               >
                  Add New User Group
               </Link>
            </div>

            <IotTable
               columns={tableColumns}
               data={getTableData(groups, userToken)}
               options={tableOptions}
            />
         </div>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   userToken: userSelectors.selectUserToken,
   currentUser: userSelectors.selectCurrentUser,
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
});

export default connect(mapStateToProps)(Configuration);
