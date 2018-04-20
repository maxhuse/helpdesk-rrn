import { Map, Record, List } from 'immutable';
import { Reducer, Dispatch } from 'redux';
import Promise from 'bluebird';
import { fetchSignal, TFetchResult } from 'ducks/fetch';
import getHashedPassword from 'tools/get-hashed-password';

/*
* Constants
* */
export const URL: string = '/api/customers';

// Action types
enum ActionTypeCustomers {
  FETCH_DONE = 'customers-data/FETCH_DONE',
  UPDATE_DONE = 'customers-data/UPDATE_DONE',
  ADD_DONE = 'customers-data/ADD_DONE',
  RESET = 'customers-data/RESET',
}

/*
* Actions
* */
type TCustomer = {
  id: string | number;
  [key: string]: any;
};
type TFetchResponse = Array<TCustomer>;

interface ICustomersResetAction {
  readonly type: ActionTypeCustomers.RESET;
}
interface ICustomersFetchDoneAction {
  readonly type: ActionTypeCustomers.FETCH_DONE;
  readonly payload: TFetchResponse;
}
interface ICustomersUpdateDoneAction {
  readonly type: ActionTypeCustomers.UPDATE_DONE;
  readonly payload: TCustomer;
}
interface ICustomersAddDoneAction {
  readonly type: ActionTypeCustomers.ADD_DONE;
  readonly payload: TCustomer;
}

type TActions = ICustomersResetAction |
  ICustomersFetchDoneAction |
  ICustomersUpdateDoneAction |
  ICustomersAddDoneAction;

const customersDataResetDelta = (): ICustomersResetAction => ({ type: ActionTypeCustomers.RESET });
const customersDataFetchDoneDelta = (data: TFetchResponse): ICustomersFetchDoneAction =>
  ({ type: ActionTypeCustomers.FETCH_DONE, payload: data });
const customersDataUpdateDoneDelta = (data: TCustomer): ICustomersUpdateDoneAction =>
  ({ type: ActionTypeCustomers.UPDATE_DONE, payload: data });
const customersDataAddDoneDelta = (data: TCustomer): ICustomersAddDoneAction =>
  ({ type: ActionTypeCustomers.ADD_DONE, payload: data });

/* Signals */
interface ICustomersDataGet {
  (): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
const customersDataGetSignal: ICustomersDataGet = () => dispatch =>
  Promise.coroutine(function* getCustomers() {
    const answer = yield dispatch(fetchSignal(URL));

    if (answer.isSuccess) {
      dispatch(customersDataFetchDoneDelta(answer.data));
    }

    return answer;
  })();

interface ICustomersDataUpdate {
  (options: { id: number | string, data: { [key: string]: any } }): (dispatch: Dispatch<any>) =>
    Promise<TFetchResult>;
}
const customersDataUpdateSignal: ICustomersDataUpdate = ({ id, data }) => dispatch =>
  Promise.coroutine(function* updateCustomers() {
    const answer = yield dispatch(fetchSignal(`${URL}/${id}`, { method: 'PATCH', body: data }));

    if (answer.isSuccess) {
      dispatch(customersDataUpdateDoneDelta(answer.data));
    }

    return answer;
  })();

interface ICustomersDataAdd {
  (options: { data: { password: string, [key: string]: any } }): (dispatch: Dispatch<any>) =>
    Promise<TFetchResult>;
}
const customersDataAddSignal: ICustomersDataAdd = ({ data }) => dispatch =>
  Promise.coroutine(function* addCustomers() {
    data.password = getHashedPassword(data.password); // eslint-disable-line no-param-reassign

    const answer = yield dispatch(fetchSignal(URL, { method: 'POST', body: data }));

    if (answer.isSuccess) {
      dispatch(customersDataAddDoneDelta(answer.data));
    }

    return answer;
  })();

export const actions = {
  customersDataResetDelta,
  customersDataGetSignal,
  customersDataUpdateSignal,
  customersDataAddSignal,
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
    case ActionTypeCustomers.FETCH_DONE: {
      const items = action.payload.map(item => Map(item));

      return state.set('data', List(items));
    }

    case ActionTypeCustomers.ADD_DONE:
      return state.update('data', data => data.push(Map(action.payload)));

    case ActionTypeCustomers.UPDATE_DONE: {
      return state.update('data', data => data.map((dataItem) => {
        if (dataItem.get('id') === action.payload.id) {
          return dataItem.merge(action.payload);
        }

        return dataItem;
      }));
    }

    case ActionTypeCustomers.RESET:
      return initialState;

    default:
      return state;
  }
};

export default reducer;

/*
* Selectors
* */
export const getActiveCustomers = (customers: TData) =>
  customers.filter(customer => customer.get('active') === 1);
