import { combineReducers } from 'redux';
import authDataIm from './auth';
// import customersDataIm from './customers';
import staffsDataIm from './staffs';

const pagesReducers = combineReducers({
  authDataIm,
  // customersDataIm,
  staffsDataIm,
});

export default pagesReducers;
