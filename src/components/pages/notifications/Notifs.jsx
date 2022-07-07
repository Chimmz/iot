import React, { useState, useEffect } from 'react';

// Redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../redux/user/user-selectors';
import * as notifActions from '../../../redux/notification/notifications-actions';
import * as notifSelectors from '../../../redux/notification/notification-selectors';

import useFetch from '../../../hooks/useFetch';

import * as dateUtils from '../../../utils/dateUtils';
import API from '../../../utils/apiUtils';
import { tableColumns, getTableData, dateFilterPeriods, sortByStartTime } from './table-config.js';

import Spinner from '../../UI/spinner/Spinner';
import IotTable from '../../iot-table/IotTable';
import './Notifs.scss';

function Notifs({ newNotifs, currentPortfolio, userToken, dispatch }) {
  const [notifications, setNotifications] = useState([]);
  const [currentTimePeriod, setCurrentTimePeriod] = useState('1-week');
  const { sendRequest: sendGetNotifsRequest, loading: notifsRequestLoading } = useFetch();
  const { sendRequest: sendMarkAsReadRequest } = useFetch();
  const loadNotifs = function () {
    const [fromDate, toDate] = dateUtils.getDateRangeBasedOnPeriod(currentTimePeriod);
    const req = sendGetNotifsRequest(
      API.getNotifications(
        userToken,
        currentPortfolio.portfolioHeaderId,
        dateUtils.getDateOnly(fromDate),
        dateUtils.getDateOnly(toDate)
      )
    );
    req.then(notifications => {
      notifications?.length && setNotifications(notifications);
    });
    req.catch(console.log);
  };

  const markUreadNotifsAsRead = () => {
    if (!newNotifs?.length) return;

    const requests = newNotifs.map(n =>
      API.markNotificationAsRead(userToken, +n.activityLogId, currentPortfolio)
    );
    const req = sendMarkAsReadRequest(Promise.all(requests));
    const remove = () => dispatch({ type: notifActions.REMOVE_NOTIFICATIONS });

    req.then(res => {
      console.log('RESPONSE FOR MARK: ', res);
      remove();
    });
    req.catch(remove);
  };

  useEffect(() => {
    if (!currentPortfolio) return;
    if (!notifsRequestLoading || notifications.length) loadNotifs();
    markUreadNotifsAsRead();
  }, [newNotifs.length, currentTimePeriod, currentPortfolio]);

  const handleDateFilter = function (evKey) {
    const periodSelected = evKey;
    if (periodSelected === currentTimePeriod) return; // If active date filter was selected again
    setCurrentTimePeriod(periodSelected); // This triggers the useEffect
  };

  return (
    <>
      <div className='card px-3 py-5 flex-grow data-card telemetry notification'>
        <Spinner show={notifsRequestLoading} message='Getting records...' />
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
  newNotifs: notifSelectors.selectUnreadNotifs,
  userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(Notifs);
