import { Map, fromJS } from 'immutable';
import Promise from 'bluebird';
import { applicationName } from 'config';
import { fetchSignal } from 'ducks/fetch';
import getHashedPassword from 'tools/get-hashed-password';

/*
* Constants
* */

export const MODULE_NAME = 'auth-data';
export const URL = '/api/auth';

// Action names
const FETCH_DONE = `${applicationName}/${MODULE_NAME}/FETCH_DONE`;
const LOGIN_DONE = `${applicationName}/${MODULE_NAME}/LOGIN_DONE`;
const UPDATE_DONE = `${applicationName}/${MODULE_NAME}/UPDATE_DONE`;
const LOGOUT_DONE = `${applicationName}/${MODULE_NAME}/LOGOUT_DONE`;
const SET_LANGUAGE = `${applicationName}/${MODULE_NAME}/SET_LANGUAGE`;
const RESET = `${applicationName}/${MODULE_NAME}/RESET`;

/*
* Reducer
* */

const initialState = Map({
  data: Map({
    id: false,
    name: false,
    login: false,
    role: false,
    email: false,
    language: window.localStorage.getItem('language') || 'en',
  }),
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DONE:
    case LOGIN_DONE: {
      const language = state.getIn(['data', 'language']);
      const data = Object.assign({ language }, action.payload);

      return state.set('data', fromJS(data));
    }

    case SET_LANGUAGE: {
      window.localStorage.setItem('language', action.payload);
      window.location.reload();

      return state;
    }

    case UPDATE_DONE: {
      return state.update('data', data => data.merge(action.payload));
    }

    case LOGOUT_DONE:
    case RESET:
      return initialState;

    default:
      return state;
  }
}

/*
* Actions
* */

const authDataResetDelta = () => ({ type: RESET });
const authDataSetLanguageDelta = language => ({ type: SET_LANGUAGE, payload: language });

const authDataGetSignal = () => dispatch => Promise.coroutine(function* getAuth() {
  const answer = yield dispatch(fetchSignal(URL));

  if (answer.isSuccess) {
    dispatch({ type: FETCH_DONE, payload: answer.data });
  }

  return answer;
})();

const authDataGetWithNoErrorsSignal = () => dispatch => Promise.coroutine(function* getAuth() {
  const answer = yield dispatch(fetchSignal(URL, { silent: true }));

  if (answer.isSuccess) {
    dispatch({ type: FETCH_DONE, payload: answer.data });
  }

  return answer;
})();

const authDataLoginSignal = ({ data }) =>
  dispatch => Promise.coroutine(function* postAuth() {
    data.password = getHashedPassword(data.password); // eslint-disable-line no-param-reassign

    const answer = yield dispatch(
      fetchSignal(URL, { method: 'POST', body: data, silent: true })
    );

    if (answer.isSuccess) {
      dispatch({ type: LOGIN_DONE, payload: answer.data });
    }

    return answer;
  })();

const authDataUpdateSignal = body => dispatch => Promise.coroutine(function* updateAuth() {
  const answer = yield dispatch(fetchSignal(URL, { method: 'PATCH', body }));

  if (answer.isSuccess) {
    dispatch({ type: UPDATE_DONE, payload: answer.data });
  }

  return answer;
})();

const authDataLogoutSignal = () => dispatch => Promise.coroutine(function* deleteAuth() {
  const answer = yield dispatch(fetchSignal(URL, { method: 'DELETE' }));

  if (answer.isSuccess) {
    dispatch({ type: LOGOUT_DONE });
  }

  return answer;
})();

const authDataLogoutAllSignal = () => dispatch => Promise.coroutine(function* deleteAuthAll() {
  const answer = yield dispatch(fetchSignal(`${URL}?all=1`, { method: 'DELETE' }));

  if (answer.isSuccess) {
    dispatch({ type: LOGOUT_DONE, payload: answer.data });
  }

  return answer;
})();

export const actions = {
  authDataResetDelta,
  authDataSetLanguageDelta,
  authDataGetSignal,
  authDataGetWithNoErrorsSignal,
  authDataLoginSignal,
  authDataUpdateSignal,
  authDataLogoutSignal,
  authDataLogoutAllSignal,
};
