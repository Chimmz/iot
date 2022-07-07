import React, { useState, useEffect } from 'react';
import { subDays } from 'date-fns';
import * as incidentUtils from '../../../../../redux/incident/incident-dashboard-utils';
import { getDateOnly } from '../../../../../utils/dateUtils';
const GetActiveIncidents = props => {
  const { currentPortfolio, userToken } = props;
  const startDate = subDays(new Date(), 1);
  const endDate = new Date();
  // Get the count between days
  const [incidents, setIncidents] = useState([]);
  const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);
  const [updateSeconds, setUpdateSeconds] = useState(0 * 1000);
  const loadIncidents = async () => {
    const makeRequest = () => {
      return incidentUtils.fetchActiveIncidents(
        currentPortfolio,
        getDateOnly(startDate),
        getDateOnly(endDate),
        userToken
      );
    };
    const res = incidentUtils.handleFilterLoadingAsync(makeRequest, setIsFilteredDataLoading);
    const incids = await res;
    setIncidents(incids);
  };

  // Initial it will be 0 seconds to get the first update and after then Dummy Effect
  useEffect(() => {
    setUpdateSeconds(1 * 1000);
  }, []);

  //refresh the component for every 1 mins to update the water flood card
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPortfolio) loadIncidents();
      setUpdateSeconds(60 * 1000);
    }, updateSeconds);
    return () => {
      clearInterval(interval);
    };
  }, [startDate, endDate, currentPortfolio?.portfolioHeaderId]);

  return incidents;
};

export default GetActiveIncidents;
