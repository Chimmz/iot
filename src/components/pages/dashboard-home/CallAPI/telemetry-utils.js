import API from '../../../../utils/apiUtils';

// This is for the water consumption usage
export const fetchWaterusage = function (portfolio, startDate, endDate, userToken) {
  // Returns a promise
  return API.getwaterConsumption(userToken, portfolio.portfolioHeaderId, startDate, endDate);
};

// This is for the water consumption usage
export const fetchHighestWaterUsage = function (portfolio, startDate, endDate, userToken) {
  // Returns a promise
  return API.getHighestwaterUsage(userToken, portfolio.portfolioHeaderId, startDate, endDate);
};

// This is for the water consumption usage
export const fetchWaterTrends = function (portfolio, startDate, endDate, userToken) {
  // Returns a promise
  return API.getWaterTrends(userToken, portfolio.portfolioHeaderId, startDate, endDate);
};

// Water consumption utils for the day based
export const fetchWaterConsumption = function (portfolio, startDate, endDate, userToken) {
  return API.getwaterConsumption(userToken, portfolio.portfolioHeaderId, startDate, endDate);
};

// water Leak quantity utils for day based. used under the insights
export const fetchLeakDayWise = function (portfolio, startDate, endDate, userToken) {
  return API.getLeakDayWise(userToken, portfolio.portfolioHeaderId, startDate, endDate);
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
