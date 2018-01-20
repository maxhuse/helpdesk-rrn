import { combineReducers } from 'redux';
import authDataIm from './auth';
import customersDataIm from './customers';
import staffsDataIm from './staffs';
import ticketsDataIm from './tickets';

const pagesReducers = combineReducers({
  authDataIm,
  customersDataIm,
  staffsDataIm,
  ticketsDataIm,
});

export default pagesReducers;
