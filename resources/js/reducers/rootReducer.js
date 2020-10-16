import {combineReducers} from 'redux';
// reducers
import authReducer from './authReducer';
import ticketsReducer  from './ticketsReducer.js';

const rootReducer = combineReducers({
    auth: authReducer,
    ticketsR: ticketsReducer
});

export default rootReducer;
