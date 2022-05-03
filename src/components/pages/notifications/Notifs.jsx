import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../redux/user/user-selectors';
import * as notificationSelectors from '../../../redux/notification/notification-selectors';

import * as notificationUtils from '../../../redux/notification/notification-utils';

import Spinner from '../../UI/spinner/Spinner';
import IotTable from '../../iot-table/IotTable';

import {
   tableColumns,
   getTableData,
   dateFilterPeriods,
   sortByStartTime
} from './table-config.js';

import PageHeader from '../../page-header/PageHeader';
import './Notifs.scss';

function Notifs(props) {
   const { currentPortfolio, userToken } = props;
   const [notifications, setNotifications] = useState([]);

   const [currentTimePeriod, setCurrentTimePeriod] = useState('1-week');
   const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

   const loadNotifs = async () => {
      const makeRequest = () => {
         return notificationUtils.fetchNotifications(
            currentPortfolio,
            currentTimePeriod,
            userToken
         );
      };
      const res = notificationUtils.handleFilterLoadingAsync(
         makeRequest,
         setIsFilteredDataLoading
      );
      const notifs = await res;
      setNotifications(notifs);
   };

   useEffect(() => {
      if (currentPortfolio) loadNotifs();

      return () => {};
   }, [currentTimePeriod, currentPortfolio?.portfolioHeaderId]);

   const handleDateFilter = function (evKey) {
      const periodSelected = evKey;
      if (periodSelected === currentTimePeriod) return; // If active date filter was selected again
      setCurrentTimePeriod(evKey);
   };

   return (
      <>
         <Spinner show={filteredDataLoading} message='Getting records...' />
         <PageHeader location={useLocation()} />
         <div className='card px-3 py-5 flex-grow data-card telemetry notification'>
            <h2 className='page-heading fw-600 mb-lg'>Notification Center </h2>

            <IotTable
               columns={tableColumns}
               data={getTableData(sortByStartTime(notifications, 'descend'))}
               currentTimePeriod={currentTimePeriod}
               dateFilterPeriods={dateFilterPeriods}
               onDateFilter={handleDateFilter}
            />
         </div>
      </>
   );
}

const mapStateToProps = createStructuredSelector({
   currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
   notificationsLoading: notificationSelectors.selectNotificationLoading,
   userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(Notifs);
