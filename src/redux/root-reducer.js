import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Exactly references the browser local storage

import alertReducer from './alert/alert-reducer';
import userReducer from './user/user-reducer';

const persistConfig = {
   key: 'root',
   storage,
   whitelist: ['user'] // Array of string names of reducers you want to persist
};

const rootReducer = combineReducers({
   user: userReducer,
   alert: alertReducer
});

export default persistReducer(persistConfig, rootReducer);
