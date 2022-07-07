import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as portfolioSelectors from '../../../redux/portfolio/portfolio-selectors';
import * as userSelectors from '../../../redux/user/user-selectors';

import useFetch from '../../../hooks/useFetch';
import API from '../../../utils/apiUtils';
import * as dateUtils from '../../../utils/dateUtils';

import Spinner from '../../UI/spinner/Spinner';
import IotTable from '../../iot-table/IotTable';

import {
  getTableColumns,
  getTableData,
  dateFilterPeriods,
  sortByStartTime
} from './table-config.js';

import PageHeader from '../../page-header/PageHeader';
import './Telemetry.scss';

function Telemetry(props) {
  const { currentPortfolio, userToken } = props;
  const [incidents, setIncidents] = useState(props.incidents);
  const [currentTimePeriod, setCurrentTimePeriod] = useState('1-week');
  const { sendRequest: sendIncidentsRequest, loading: incidentsRequestLoading } = useFetch();

  const loadIncidents = async () => {
    const [fromDate, toDate] = dateUtils.getDateRangeBasedOnPeriod(currentTimePeriod);

    const res = sendIncidentsRequest(
      API.getIncidentsByPortfolio(
        userToken,
        currentPortfolio.portfolioHeaderId,
        dateUtils.getDateOnly(fromDate),
        dateUtils.getDateOnly(toDate)
      )
    );
    const incids = await res;
    setIncidents(incids);
  };

  // Load new incidents if either (current time period or portfolio) changes
  useEffect(() => {
    if (currentPortfolio) loadIncidents();
  }, [currentTimePeriod, currentPortfolio?.portfolioHeaderId]);

  const handlePeriodFilter = function (evKey) {
    const selectedPeriod = evKey;
    if (selectedPeriod === currentTimePeriod) return; // If active date filter was selected again
    setCurrentTimePeriod(selectedPeriod);
  };

  return (
    <>
      <PageHeader location={useLocation()} />
      <div className='card px-3 py-5 flex-grow data-card telemetry' id='telemetryTable'>
        <h2 className='page-heading fw-600 mb-lg'>Telemetry </h2>

        <IotTable
          columns={getTableColumns(props)}
          data={getTableData(sortByStartTime(incidents, 'descend'))}
          currentTimePeriod={currentTimePeriod}
          dateFilterPeriods={dateFilterPeriods}
          onDateFilter={handlePeriodFilter}
        />
      </div>
      <Spinner show={incidentsRequestLoading} message='Getting records...' />
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  currentPortfolio: portfolioSelectors.selectCurrentPortfolio,
  userToken: userSelectors.selectUserToken
});

export default connect(mapStateToProps)(Telemetry);
