import { Map, fromJS } from 'immutable';
import { applicationName } from 'config';
import { fetchSignal } from 'ducks/fetch';

/*
* Constants
* */

export const MODULE_NAME = 'messages-data';
export const URL = '/api/messages';

// Action names
const FETCH_DONE = `${applicationName}/${MODULE_NAME}/FETCH_DONE`;
const ADD_DONE = `${applicationName}/${MODULE_NAME}/ADD_DONE`;
const RESET = `${applicationName}/${MODULE_NAME}/RESET`;

/*
* Reducer
* */

const initialState = Map({ data: false });

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DONE:
      return state.set('data', fromJS(action.payload));

    case ADD_DONE:
      return state.update('data', data => data.push(fromJS(action.payload)));

    case RESET:
      return initialState;

    default:
      return state;
  }
}

/*
* Actions
* */

const messagesDataResetDelta = () => ({ type: RESET });

const messagesDataGetSignal = ({ ticketId }) =>
  dispatch => Promise.coroutine(function* getMessages() {
    const answer = yield dispatch(fetchSignal(`${URL}?ticket=${ticketId}`));

    if (answer.isSuccess) {
      dispatch({ type: FETCH_DONE, payload: answer.data });
    }

    return answer;
  })();

const messagesDataAddSignal = ({ data }) => dispatch => Promise.coroutine(function* addMessage() {
  const answer = yield dispatch(fetchSignal(URL, { method: 'POST', body: data }));

  if (answer.isSuccess) {
    dispatch({ type: ADD_DONE, payload: answer.data });
  }

  return answer;
})();

export const actions = {
  messagesDataResetDelta,
  messagesDataGetSignal,
  messagesDataAddSignal,
};
