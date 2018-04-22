import { Map, List, Record } from 'immutable';
import { Dispatch, Reducer } from 'redux';
import Promise from 'bluebird';
import { fetchSignal, TFetchResult } from 'ducks/fetch';

/*
* Constants
* */
export const URL: string = '/api/messages';

// Action types
enum ActionTypeMessages {
  FETCH_DONE = 'messages-data/FETCH_DONE',
  ADD_DONE = 'messages-data/ADD_DONE',
  RESET = 'messages-data/RESET',
}

/*
* Actions
* */
type TMessage = {
  id: string | number;
  [key: string]: any;
};
type TFetchResponse = Array<TMessage>;

interface IMessagesResetAction {
  readonly type: ActionTypeMessages.RESET;
}
interface IMessagesFetchDoneAction {
  readonly type: ActionTypeMessages.FETCH_DONE;
  readonly payload: TFetchResponse;
}
interface IMessagesAddDoneAction {
  readonly type: ActionTypeMessages.ADD_DONE;
  readonly payload: TMessage;
}

type TActions = IMessagesResetAction |
  IMessagesFetchDoneAction |
  IMessagesAddDoneAction;

const messagesDataResetDelta = (): IMessagesResetAction => ({ type: ActionTypeMessages.RESET });
const messagesDataFetchDoneDelta = (data: TFetchResponse): IMessagesFetchDoneAction =>
  ({ type: ActionTypeMessages.FETCH_DONE, payload: data });
const messagesDataAddDoneDelta = (data: TMessage): IMessagesAddDoneAction =>
  ({ type: ActionTypeMessages.ADD_DONE, payload: data });

/* Signals */
interface IMessagesDataGet {
  (options: { ticketId: string | number }): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
const messagesDataGetSignal: IMessagesDataGet = ({ ticketId }) => dispatch =>
  Promise.coroutine(function* getMessages() {
    const answer = yield dispatch(fetchSignal(`${URL}?ticket=${ticketId}`));

    if (answer.isSuccess) {
      dispatch(messagesDataFetchDoneDelta(answer.data));
    }

    return answer;
  })();

interface IMessagesDataAdd {
  (options: { data: { [key: string]: any } }): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
const messagesDataAddSignal: IMessagesDataAdd = ({ data }) => dispatch =>
  Promise.coroutine(function* addMessage() {
    const answer = yield dispatch(fetchSignal(URL, { method: 'POST', body: data }));

    if (answer.isSuccess) {
      dispatch(messagesDataAddDoneDelta(answer.data));
    }

    return answer;
  })();

export const actions = {
  messagesDataResetDelta,
  messagesDataGetSignal,
  messagesDataAddSignal,
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
    case ActionTypeMessages.FETCH_DONE: {
      const items = action.payload.map(item => Map(item));

      return state.set('data', List(items));
    }

    case ActionTypeMessages.ADD_DONE:
      return state.update('data', data => data.push(Map(action.payload)));

    case ActionTypeMessages.RESET:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
