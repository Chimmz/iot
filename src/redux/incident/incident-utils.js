import API from '../../utils/apiUtils';
import * as dateUtils from '../../utils/dateUtils';

export const fetchIncidents = function (portfolio, timePeriod, userToken) {
  const [...dates] = dateUtils.getDateRangeBasedOnPeriod(timePeriod);

  // Returns a promise
  return API.getIncidentsByPortfolio(
    userToken,
    portfolio.portfolioHeaderId,
    ...dates.map(date => date)
  );
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
