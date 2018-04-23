import {Map, List, Record} from 'immutable';
import { Reducer, Dispatch } from 'redux';
import Promise from 'bluebird';
import { fetchSignal, TFetchResult } from 'ducks/fetch';

/*
* Constants
* */
export const URL: string = '/api/tickets';

// Action types
enum ActionTypeTickets {
  FETCH_DONE = 'tickets-data/FETCH_DONE',
  UPDATE_DONE = 'tickets-data/UPDATE_DONE',
  ADD_DONE = 'tickets-data/ADD_DONE',
  RESET = 'tickets-data/RESET',
}

/*
* Actions
* */
type TTicket = {
  id: string | number;
  [key: string]: any;
};
type TFetchResponse = Array<TTicket>;

interface ITicketsResetAction {
  readonly type: ActionTypeTickets.RESET;
}
interface ITicketsFetchDoneAction {
  readonly type: ActionTypeTickets.FETCH_DONE;
  readonly payload: TFetchResponse;
}
interface ITicketsUpdateDoneAction {
  readonly type: ActionTypeTickets.UPDATE_DONE;
  readonly payload: TTicket;
}
interface ITicketsAddDoneAction {
  readonly type: ActionTypeTickets.ADD_DONE;
  readonly payload: TTicket;
}

type TActions = ITicketsResetAction |
  ITicketsFetchDoneAction |
  ITicketsUpdateDoneAction |
  ITicketsAddDoneAction;

const ticketsDataResetDelta = (): ITicketsResetAction => ({ type: ActionTypeTickets.RESET });
const ticketsDataFetchDoneDelta = (data: TFetchResponse): ITicketsFetchDoneAction =>
  ({ type: ActionTypeTickets.FETCH_DONE, payload: data });
const ticketsDataUpdateDoneDelta = (data: TTicket): ITicketsUpdateDoneAction =>
  ({ type: ActionTypeTickets.UPDATE_DONE, payload: data });
const ticketsDataAddDoneDelta = (data: TTicket): ITicketsAddDoneAction =>
  ({ type: ActionTypeTickets.ADD_DONE, payload: data });

/* Signals */
interface ITicketsDataGet {
  (): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
const ticketsDataGetSignal: ITicketsDataGet = () => dispatch =>
  Promise.coroutine(function* getTickets() {
    const answer = yield dispatch(fetchSignal(URL));

    if (answer.isSuccess) {
      dispatch(ticketsDataFetchDoneDelta(answer.data));
    }

    return answer;
  })();

interface ITicketsDataUpdate {
  (options: { id: number | string, data: { [key: string]: any } }): (dispatch: Dispatch<any>) =>
    Promise<TFetchResult>;
}
const ticketsDataUpdateSignal: ITicketsDataUpdate = ({ id, data }) => dispatch =>
  Promise.coroutine(function* updateTicket() {
    const answer = yield dispatch(fetchSignal(`${URL}/${id}`, { method: 'PATCH', body: data }));

    if (answer.isSuccess) {
      dispatch(ticketsDataUpdateDoneDelta(answer.data));
    }

    return answer;
  })();

interface ITicketsDataAdd {
  (options: { data: { [key: string]: any } }): (dispatch: Dispatch<any>) =>
    Promise<TFetchResult>;
}
const ticketsDataAddSignal: ITicketsDataAdd = ({ data }) => dispatch =>
  Promise.coroutine(function* addTicket() {
    const answer = yield dispatch(fetchSignal(URL, { method: 'POST', body: data }));

    if (answer.isSuccess) {
      dispatch(ticketsDataAddDoneDelta(answer.data));
    }

    return answer;
  })();

export const actions = {
  ticketsDataResetDelta,
  ticketsDataGetSignal,
  ticketsDataUpdateSignal,
  ticketsDataAddSignal,
};

// State
export type TDataItem = Map<string, any>;
export type TData = List<TDataItem>;
interface IStateFactory {
  data: TData;
}
const StateFactory = Record<IStateFactory>({ data: List() });

const initialState = new StateFactory();
export type TState = typeof initialState;

/*
* Reducer
* */
const reducer: Reducer<TState> = (state = initialState, action: TActions) => {
  switch (action.type) {
    case ActionTypeTickets.FETCH_DONE: {
      const items = action.payload.map(item => Map(item));

      return state.set('data', List(items));
    }

    case ActionTypeTickets.ADD_DONE:
      return state.update('data', data => data.push(Map(action.payload)));

    case ActionTypeTickets.UPDATE_DONE: {
      return state.update('data', data => data.map((dataItem) => {
        if (dataItem.get('id') === action.payload.id) {
          return dataItem.merge(action.payload);
        }

        return dataItem;
      }));
    }

    case ActionTypeTickets.RESET:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
