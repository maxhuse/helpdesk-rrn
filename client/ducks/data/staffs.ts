import { Map, Record, List } from 'immutable';
import { Reducer, Dispatch } from 'redux';
import Promise from 'bluebird';
import { fetchSignal, TFetchResult } from 'ducks/fetch';
import getHashedPassword from 'tools/get-hashed-password';

/*
* Constants
* */
export const URL: string = '/api/staffs';

// Action types
enum ActionTypeStaffs {
  FETCH_DONE = 'staffs-data/FETCH_DONE',
  UPDATE_DONE = 'staffs-data/UPDATE_DONE',
  ADD_DONE = 'staffs-data/ADD_DONE',
  RESET = 'staffs-data/RESET',
}

/*
* Actions
* */
type TStaff = {
  id: string | number;
  [key: string]: any;
};
type TFetchResponse = Array<TStaff>;

interface IStaffsResetAction {
  readonly type: ActionTypeStaffs.RESET;
}
interface IStaffsFetchDoneAction {
  readonly type: ActionTypeStaffs.FETCH_DONE;
  readonly payload: TFetchResponse;
}
interface IStaffsUpdateDoneAction {
  readonly type: ActionTypeStaffs.UPDATE_DONE;
  readonly payload: TStaff;
}
interface IStaffsAddDoneAction {
  readonly type: ActionTypeStaffs.ADD_DONE;
  readonly payload: TStaff;
}

type TActions = IStaffsResetAction |
  IStaffsFetchDoneAction |
  IStaffsUpdateDoneAction |
  IStaffsAddDoneAction;

const staffsDataResetDelta = (): IStaffsResetAction => ({ type: ActionTypeStaffs.RESET });
const staffsDataFetchDoneDelta = (data: TFetchResponse): IStaffsFetchDoneAction =>
  ({ type: ActionTypeStaffs.FETCH_DONE, payload: data });
const staffsDataUpdateDoneDelta = (data: TStaff): IStaffsUpdateDoneAction =>
  ({ type: ActionTypeStaffs.UPDATE_DONE, payload: data });
const staffsDataAddDoneDelta = (data: TStaff): IStaffsAddDoneAction =>
  ({ type: ActionTypeStaffs.ADD_DONE, payload: data });

/* Signals */
interface IStaffsDataGet {
  (): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
const staffsDataGetSignal: IStaffsDataGet = () => dispatch =>
  Promise.coroutine(function* getStaffs() {
    const answer = yield dispatch(fetchSignal(URL));

    if (answer.isSuccess) {
      dispatch(staffsDataFetchDoneDelta(answer.data));
    }

    return answer;
  })();

interface IStaffsDataUpdate {
  (options: { id: number | string, data: { [key: string]: any } }): (dispatch: Dispatch<any>) =>
    Promise<TFetchResult>;
}
const staffsDataUpdateSignal: IStaffsDataUpdate = ({ id, data }) => dispatch =>
  Promise.coroutine(function* updateStaffs() {
    const answer = yield dispatch(fetchSignal(`${URL}/${id}`, { method: 'PATCH', body: data }));

    if (answer.isSuccess) {
      dispatch(staffsDataUpdateDoneDelta(answer.data));
    }

    return answer;
  })();

interface IStaffsDataAdd {
  (options: { data: { password: string, [key: string]: any } }): (dispatch: Dispatch<any>) =>
    Promise<TFetchResult>;
}
const staffsDataAddSignal: IStaffsDataAdd = ({ data }) => dispatch =>
  Promise.coroutine(function* addStaffs() {
    data.password = getHashedPassword(data.password); // eslint-disable-line no-param-reassign

    const answer = yield dispatch(fetchSignal(URL, { method: 'POST', body: data }));

    if (answer.isSuccess) {
      dispatch(staffsDataAddDoneDelta(answer.data));
    }

    return answer;
  })();

export const actions = {
  staffsDataResetDelta,
  staffsDataGetSignal,
  staffsDataUpdateSignal,
  staffsDataAddSignal,
};

/* State */
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
    case ActionTypeStaffs.FETCH_DONE: {
      const items = action.payload.map(item => Map(item));

      return state.set('data', List(items));
    }

    case ActionTypeStaffs.ADD_DONE:
      return state.update('data', data => data.push(Map(action.payload)));

    case ActionTypeStaffs.UPDATE_DONE: {
      return state.update('data', data => data.map((dataItem) => {
        if (dataItem.get('id') === action.payload.id) {
          return dataItem.merge(action.payload);
        }

        return dataItem;
      }));
    }

    case ActionTypeStaffs.RESET:
      return initialState;

    default:
      return state;
  }
};

export default reducer;

/*
* Selectors
* */
export const getActiveStaffs = staffs => staffs.filter(staff => staff.get('active') === 1);
