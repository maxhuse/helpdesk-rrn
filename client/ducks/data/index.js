import { combineReducers } from 'redux';
import authDataIm from './auth';
import customersDataIm from './customers';
import staffsDataIm from './staffs';
import ticketsDataIm from './tickets';
import messagesDataIm from './messages';

const pagesReducers = combineReducers({
  authDataIm,
  customersDataIm,
  staffsDataIm,
  ticketsDataIm,
  messagesDataIm,
});

export default pagesReducers;
