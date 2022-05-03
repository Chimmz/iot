import { SET_IOTDEVICES_LOADING, GET_IOTDEVICES } from './iotDevices-actions';
import * as asyncUtils from '../../utils/asyncUtils';
import iotDeviceUtils from './iotDevice-utils';

export const setIotDeviceLoading = boolean => ({
    type: SET_IOTDEVICES_LOADING,
    payload: {isLoading: boolean}
});

export function getIotDevices(portfolio,userToken){
    return async dispatch => {
        try{
            const makeRequest = () => {
                return asyncUtils.getResponseWithinTimout(
                    iotDeviceUtils.fetchIotDevices(portfolio,userToken),
                    '30secs',
                );
            };
            const res = asyncUtils.handleLoadingStateAsync(
                makeRequest,
                setIotDeviceLoading,
                dispatch
            );

            const iotDevices = (await res) || [];
                    
            display({
                type: GET_IOTDEVICES,
                payload: {
                    portfolioName: portfolio.name,
                    iotDevices
                }
            });
        } catch (err) {
            console.log(err);
        }
    };
}