import React, { useState, useEffect } from 'react';

// This is only for the water usage and cost calculation
import * as WaterAPIUtils from '../../CallAPI/telemetry-utils';
import { getDateOnly } from '../../../../../utils/dateUtils';

// This is to fetch the data from the API and provide the output to the UI
// Calling from the dashboardHighlights.jsx
const GetWaterTrend = props => {
  const { currentPortfolio, userToken } = props.Auth;
  const startDate = props.Dates['startDate'];
  const endDate = props.Dates['endDate'];
  const [waterTrends, setwaterTrends] = useState({});
  const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

  const fetchWaterTrendings = async () => {
    const makeRequest = () => {
      return WaterAPIUtils.fetchWaterTrends(
        currentPortfolio,
        getDateOnly(startDate),
        getDateOnly(endDate),
        userToken
      );
    };
    const res = WaterAPIUtils.handleFilterLoadingAsync(makeRequest, setIsFilteredDataLoading);
    const WaterTrend = await res;

    if (WaterTrend.length > 0) {
      // Remove those keys before preprocessing it is not required for the current component work.
      WaterTrend.forEach((value, key, WaterTrend) => {
        // Change the timeStamp to standard format from YYYY-MM-DD
        WaterTrend[key]['dateTimeStamp'] = new Date(WaterTrend[key]['dateTimeStamp']);
        // Convert the Liter to Galon
        WaterTrend[key]['galon'] = parseFloat((WaterTrend[key]['reading'] * 0.26417).toFixed(2));
      });
    }
    setwaterTrends(WaterTrend);
  };

  // This is for the calling up the API fetch water
  useEffect(() => {
    if (currentPortfolio) fetchWaterTrendings();
  }, [startDate, endDate, currentPortfolio?.portfolioHeaderId]);

  return waterTrends;
};

export default GetWaterTrend;
