import { combineReducers } from 'redux';
import authDataIm, { TState as TAuthState } from './auth';
import customersDataIm, { TState as TCustomersState } from './customers';
import staffsDataIm, { TState as TStaffsState } from './staffs';
import ticketsDataIm, { TState as TTicketsState } from './tickets';
import messagesDataIm, { TState as TMessagesState } from './messages';

interface IComponentsState {
  authDataIm: TAuthState;
  customersDataIm: TCustomersState;
  staffsDataIm: TStaffsState;
  ticketsDataIm: TTicketsState;
  messagesDataIm: TMessagesState;
}

const pagesReducers = combineReducers<IComponentsState>({
  authDataIm,
  customersDataIm,
  staffsDataIm,
  ticketsDataIm,
  messagesDataIm,
});

export default pagesReducers;
