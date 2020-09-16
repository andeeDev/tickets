import {combineReducers} from 'redux';
// reducers
import authReducers from './authReducer';

const rootReducer = combineReducers({
    auth: authReducers
});

export default rootReducer;
