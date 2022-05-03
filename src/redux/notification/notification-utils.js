import API from '../../utils/apiUtils';
import * as dateUtils from '../../utils/dateUtils';

export const fetchNotifications = function(portfolio, timePeriod, userToken) {

    // return API.getNotifications(userToken, portfolio, timePeriod);
    const [...dates] = dateUtils.getDateRangeBasedOnPeriod(timePeriod);

   // Returns a promise
   return API.getNotifications(
      userToken,
      portfolio.portfolioHeaderId,
      ...dates.map(date => date.toISOString())
   );
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