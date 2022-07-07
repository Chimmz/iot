import React, { useState, useEffect } from 'react';
import { subDays, differenceInDays } from 'date-fns';

// This is for the calling API
import * as incidentUtils from '../../../../../redux/incident/incident-dashboard-utils';
import { getDateOnly } from '../../../../../utils/dateUtils';

const FetchResponseTime = props => {
  const { Auth, Dates } = props;
  const { currentPortfolio, userToken } = Auth;
  const startDate = Dates['startDate'];
  const endDate = Dates['endDate'];
  // taking the previous date due to API response return as group total value
  const getDaysCount = differenceInDays(endDate, startDate) + 1;
  const previousStartDate = subDays(Dates['startDate'], getDaysCount);
  const previousEndDate = subDays(Dates['startDate'], 1);
  // We are making this as array to call the API two time for getting the percentage value
  const [dateRange, setDateRange] = useState({
    start: startDate,
    end: endDate,
    prevStart: previousStartDate,
    prevEnd: previousEndDate
  });
  // Current response time by startDate and endDate
  const [userResponse, setUserResponse] = useState([]);
  // Previous response time by PreviousStartDate and PreviousEndDate
  // const [PreviousUserResponse, setPreviousUserResponse] = useState([]);
  const [filteredDataLoading, setIsFilteredDataLoading] = useState(false);

  // This is for the current date range
  const loadUserResponse = async props => {
    const { Data, start, end, prevStart, prevEnd } = props;
    const makeRequest = () => {
      if (Data === 1) {
        return incidentUtils.fetchUserResponseTime(
          currentPortfolio,
          getDateOnly(start),
          getDateOnly(end),
          userToken
        );
      } else if (Data === 2) {
        return incidentUtils.fetchUserResponseTime(
          currentPortfolio,
          getDateOnly(prevStart),
          prevEnd,
          userToken
        );
      }
    };
    const res = incidentUtils.handleFilterLoadingAsync(makeRequest, setIsFilteredDataLoading);
    const incids = await res;
    if (Data === 1) {
      setUserResponse(incids);
    }
    /**commented due to its not required for percetange calculation currently */
    // else if (Data === 2) {
    //    setPreviousUserResponse(incids);
    // }
  };

  // This is to first update the date so that next useEffect of the dateRange will be triggered.
  useEffect(() => {
    setDateRange({
      start: startDate,
      end: endDate,
      prevStart: previousStartDate,
      prevEnd: previousEndDate
    });
  }, [startDate, endDate]);

  useEffect(() => {
    if (currentPortfolio) {
      loadUserResponse({ Data: 1, ...dateRange });
      //loadUserResponse({ Data: 2, ...dateRange });
    }
  }, [dateRange, currentPortfolio?.portfolioHeaderId]);
  // var oldresponsehrs = PreviousUserResponse.map(Data => {
  //    return Data.averageMinutes;
  // });
  var DisplayUserResponse = userResponse.map(Data => {
    return Data.averageMinutes;
  });
  return { DisplayUserResponse, getDaysCount };
};

function UsrResponse(props) {
  var { DisplayUserResponse, getDaysCount } = FetchResponseTime(props);
  return (
    <>
      <div className='card dashboard-card'>
        <div className='card-header'>
          <div className='text-primary'>
            <b>User Response Time</b>
          </div>
        </div>
        <div className='card-body'>
          <div className='d-flex justify-content-between align-items-center px-3 py-2 flex-wrap'>
            <div>
              <span className='h4'>{DisplayUserResponse} mins</span>
            </div>
            <img src={process.env.PUBLIC_URL + '/images/dashboard/UserResponseTime.png'} />
          </div>
          <div className='d-flex justify-content-between px-3'>
            <span></span>
          </div>
        </div>
        <div className='card-footer bg-white'>
          <b>{getDaysCount}</b> days count
        </div>
      </div>
    </>
  );
}

export default UsrResponse;
