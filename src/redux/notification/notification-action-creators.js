import { SET_NOTIFICATIONS_LOADING, GET_NOTIFICATIONS } from './notifications-actions';
import API from '../../utils/apiUtils';
import * as asyncUtils from '../../utils/asyncUtils';
import * as dateUtils from '../../utils/dateUtils';
import * as notificationUtils from './notification-utils';

export const setNotificationLoading = boolean => ({
    type: SET_NOTIFICATIONS_LOADING,
    payload: { isLoading: boolean }
});
export function getNotifications(portfolio, timePeriod, userToken) {
    return async dispatch => {
        try {
            // A function that returns an unawaited promise
            const makeRequest = () => {
                return asyncUtils.getResponseWithinTimeout(
                    notificationUtils.fetchNotifications(portfolio, timePeriod, userToken),
                    '30secs'
                );
            };

            const res = asyncUtils.handleLoadingStateAsync(
                makeRequest,
                setNotificationLoading,
                dispatch
            );

            const notifications = (await res) || [];
            console.log(notifications);

            dispatch({
                type: GET_NOTIFICATIONS,
                payload: { portfolioName: portfolio.name, notifications }
            });
        } catch (err) {
            console.log(err);
        }
    };
}