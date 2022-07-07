import API from '../../utils/apiUtils';
//import * as dateUtils from '../../utils/dateUtils';

export const fetchIncidents = function (portfolio, startDate, endDate, userToken) {
  // Returns a promise
  return API.getIncidentsByPortfolio(userToken, portfolio.portfolioHeaderId, startDate, endDate);
};

export const fetchActiveIncidents = function (portfolio, startDate, endDate, userToken) {
  // Returns a promise
  return API.getActiveIncidentsByPortfolio(
    userToken,
    portfolio.portfolioHeaderId,
    startDate,
    endDate
  );
};

// This is for the fetch response time by portfolio
export const fetchUserResponseTime = function (portfolio, startDate, endDate, userToken) {
  return API.getResponseTimeByPortfolio(userToken, portfolio.portfolioHeaderId, startDate, endDate);
};

// This is for to fetch the Get incident by category using under the IncidentStatus.jsx
export const fetchGetIncidentByCategory = function (portfolio, startDate, endDate, userToken) {
  return API.getIncidentByCategory(userToken, portfolio.portfolioHeaderId, startDate, endDate);
};

export const handleFilterLoadingAsync = (fn, setLoading) => {
  setLoading(true);

  return fn()
    .then(res => {
      setLoading(false);
      return res;
    })
    .catch(err => {
      setLoading(false);
      throw err;
    });
};
