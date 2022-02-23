import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Exactly references the browser local storage
import * as browserUtils from '../utils/browserUtils';

import alertReducer from './alert/alert-reducer';
import userReducer from './user/user-reducer';

console.log(browserUtils.getCookieValue('_itek-remember'));

const whitelist = ['user'];

// const rememberMeCookieValue = browserUtils.getCookieValue('_itek-remember');
// if (rememberMeCookieValue) whitelist.push('user');

const persistConfig = {
   key: 'root',
   storage,
   whitelist // Array of string names of reducers you want to persist
};

const rootReducer = combineReducers({
   user: userReducer,
   alert: alertReducer
});

export default persistReducer(persistConfig, rootReducer);
