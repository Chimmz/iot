import React, { useState, useEffect } from 'react';

import * as incidentUtils from '../../../../../redux/incident/incident-dashboard-utils';

import { getDateOnly } from '../../../../../utils/dateUtils';

// This is to fetch the data from the API and provide the output to the UI
// Calling from the dashboardHighlights.jsx
const GetIncidents = props => {
  const { currentPortfolio, userToken } = props.Auth;
  const startDate = props.Dates['startDate'];
  const endDate = props.Dates['endDate'];
  console.log(startDate, endDate);
  const [incidents, setIncidents] = useState([]);
  const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

  const loadIncidents = async () => {
    const makeRequest = () => {
      return incidentUtils.fetchIncidents(
        currentPortfolio,
        getDateOnly(startDate), // sending date only
        getDateOnly(endDate), // sending date only
        userToken
      );
    };
    const res = incidentUtils.handleFilterLoadingAsync(makeRequest, setIsFilteredDataLoading);
    const incids = await res;
    setIncidents(incids);
  };

  useEffect(() => {
    if (currentPortfolio) loadIncidents();
  }, [startDate, endDate, currentPortfolio?.portfolioHeaderId]);

  return incidents;
};

export default GetIncidents;
