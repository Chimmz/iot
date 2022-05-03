import { GET_INCIDENTS, SET_INCIDENTS_LOADING } from './incident-actions';
import API from '../../utils/apiUtils';
import * as asyncUtils from '../../utils/asyncUtils';
import * as dateUtils from '../../utils/dateUtils';
import * as incidentUtils from './incident-utils';

export const setIncidentLoading = boolean => ({
   type: SET_INCIDENTS_LOADING,
   payload: { isLoading: boolean }
});

export function getIncidents(portfolio, timePeriod, userToken) {
   return async dispatch => {
      try {
         // A function that returns an unawaited promise
         const makeRequest = () => {
            return asyncUtils.getResponseWithinTimeout(
               incidentUtils.fetchIncidents(portfolio, timePeriod, userToken),
               '30secs'
            );
         };

         const res = asyncUtils.handleLoadingStateAsync(
            makeRequest,
            setIncidentLoading,
            dispatch
         );

         const incidents = (await res) || [];
         console.log(incidents);

         dispatch({
            type: GET_INCIDENTS,
            payload: { portfolioName: portfolio.name, incidents }
         });
      } catch (err) {
         console.log(err);
      }
   };
}
