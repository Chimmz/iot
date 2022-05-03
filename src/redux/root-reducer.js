import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Exactly references the browser local storage
import * as browserUtils from '../utils/browserUtils';

import alertReducer from './alert/alert-reducer';
import userReducer from './user/user-reducer';
import portfolioReducer from './portfolio/portfolio-reducer';
import incidentReducer from './incident/incident-reducer';
import notificationReducer from './notification/notification-reducer';
import iotDeviceReducer from './iot-devices/iotDevice-reducer';

const persistConfig = {
   key: 'root',
   storage,
   whitelist: ['user', 'portfolio'] // Array of string names of reducers you want to persist
};

const rootReducer = combineReducers({
   user: userReducer,
   alert: alertReducer,
   portfolio: portfolioReducer,
   incident: incidentReducer,
   notification: notificationReducer,
   iotDevice:iotDeviceReducer

});

export default persistReducer(persistConfig, rootReducer);
