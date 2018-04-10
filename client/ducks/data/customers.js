import { Map, fromJS } from 'immutable';
import Promise from 'bluebird';
import { applicationName } from 'config';
import { fetchSignal } from 'ducks/fetch';
import getHashedPassword from 'tools/get-hashed-password';

/*
* Constants
* */

export const MODULE_NAME = 'customers-data';
export const URL = '/api/customers';

// Action names
const FETCH_DONE = `${applicationName}/${MODULE_NAME}/FETCH_DONE`;
const UPDATE_DONE = `${applicationName}/${MODULE_NAME}/UPDATE_DONE`;
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

    case UPDATE_DONE: {
      return state.update('data', data => data.map((dataItem) => {
        if (dataItem.get('id') === action.payload.id) {
          return dataItem.merge(action.payload);
        }

        return dataItem;
      }));
    }

    case RESET:
      return initialState;

    default:
      return state;
  }
}

/*
* Actions
* */

const customersDataResetDelta = () => ({ type: RESET });

const customersDataGetSignal = () => dispatch => Promise.coroutine(function* getCustomers() {
  const answer = yield dispatch(fetchSignal(URL));

  if (answer.isSuccess) {
    dispatch({ type: FETCH_DONE, payload: answer.data });
  }

  return answer;
})();

const customersDataUpdateSignal = ({ id, data }) =>
  dispatch => Promise.coroutine(function* updateCustomers() {
    const answer = yield dispatch(fetchSignal(`${URL}/${id}`, { method: 'PATCH', body: data }));

    if (answer.isSuccess) {
      dispatch({ type: UPDATE_DONE, payload: answer.data });
    }

    return answer;
  })();

const customersDataAddSignal = ({ data }) =>
  dispatch => Promise.coroutine(function* addCustomers() {
    data.password = getHashedPassword(data.password); // eslint-disable-line no-param-reassign

    const answer = yield dispatch(fetchSignal(URL, { method: 'POST', body: data }));

    if (answer.isSuccess) {
      dispatch({ type: ADD_DONE, payload: answer.data });
    }

    return answer;
  })();

export const actions = {
  customersDataResetDelta,
  customersDataGetSignal,
  customersDataUpdateSignal,
  customersDataAddSignal,
};

/*
* Selectors
* */
export const getActiveCustomers = customers =>
  customers.filter(customer => customer.get('active') === 1);
