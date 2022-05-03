import * as iotDeviceActions from './iotDevices-actions';
import * as userActions from '../user/user-actions';

const initState = { isLoading:false };

const iotDeviceReducer = function (state=initState, action){
    const {payload}=action;
    switch(action.type){
        case iotDeviceActions.GET_IOTDEVICES:
            return {...state,[payload.portioName]:[...payload.iotDevices]};
        case iotDeviceActions.SET_IOTDEVICES_LOADING:
            return {...state, isLoading:payload.isLoading};
        case userActions.LOGOUT_USER:
            return initState;
        default:
            return state;
    }
};

export default iotDeviceReducer;