import API from '../../utils/apiUtils';
//import * as dateUtils from '../../utils/dateUtils';

export const fetchIncidents = function (portfolio, startDate, endDate, userToken) {
   // Returns a promise
   return API.getIncidentsByPortfolio(
      userToken,
      portfolio.portfolioHeaderId, 
      startDate.toISOString(),
      endDate.toISOString()
   );
};

export const fetchActiveIncidents = function (portfolio, startDate, endDate, userToken) {
   // Returns a promise
   return API.getActiveIncidentsByPortfolio(
      userToken,
      portfolio.portfolioHeaderId, 
      startDate.toISOString(),
      endDate.toISOString()
   );
};

// This is for the fetch response time by portfolio
export const fetchUserResponseTime = function(portfolio, startDate, endDate, userToken){
   return API.getResponseTimeByPortfolio(
      userToken,
      portfolio.portfolioHeaderId,
      startDate.toISOString(),
      endDate.toISOString()
   )
}

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
