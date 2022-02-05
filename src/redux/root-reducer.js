import { combineReducers } from 'redux';
import alertReducer from './alert/alert-reducer';
import userReducer from './user/user-reducer';

const reducers = combineReducers({
   user: userReducer,
   alert: alertReducer
});

export default reducers;
