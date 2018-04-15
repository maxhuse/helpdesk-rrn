import { Record } from 'immutable';
import { Reducer, Dispatch } from 'redux';
import Promise from 'bluebird';
import { fetchSignal, TFetchResult } from 'ducks/fetch';
import getHashedPassword from 'tools/get-hashed-password';

/*
* Constants
* */
export const URL: string = '/api/auth';

// Action types
enum ActionTypeAuth {
  FETCH_DONE = 'auth-data/FETCH_DONE',
  LOGIN_DONE = 'auth-data/LOGIN_DONE',
  UPDATE_DONE = 'auth-data/UPDATE_DONE',
  LOGOUT_DONE = 'auth-data/LOGOUT_DONE',
  SET_LANGUAGE = 'auth-data/SET_LANGUAGE',
  RESET = 'auth-data/RESET',
}

/*
* Actions
* */
type TFetchResponse = {
  id?: boolean | number,
  name?: boolean | string,
  login?: boolean | string,
  role?: boolean | string,
  email?: boolean | string,
};

interface IAuthResetAction {
  readonly type: ActionTypeAuth.RESET;
}
interface IAuthSetLanguageAction {
  readonly type: ActionTypeAuth.SET_LANGUAGE;
  readonly payload: string;
}
interface IAuthFetchDoneAction {
  readonly type: ActionTypeAuth.FETCH_DONE;
  readonly payload: TFetchResponse;
}
interface IAuthLoginDoneAction {
  readonly type: ActionTypeAuth.LOGIN_DONE;
  readonly payload: TFetchResponse;
}
interface IAuthUpdateDoneAction {
  readonly type: ActionTypeAuth.UPDATE_DONE;
  readonly payload: TFetchResponse;
}
interface IAuthLogoutDoneAction {
  readonly type: ActionTypeAuth.LOGOUT_DONE;
}

type TActions =
  IAuthResetAction |
  IAuthSetLanguageAction |
  IAuthFetchDoneAction |
  IAuthLoginDoneAction |
  IAuthUpdateDoneAction |
  IAuthLogoutDoneAction;

const authDataResetDelta = (): IAuthResetAction => ({ type: ActionTypeAuth.RESET });
const authDataSetLanguageDelta = (language: string): IAuthSetLanguageAction =>
  ({ type: ActionTypeAuth.SET_LANGUAGE, payload: language });
const authDataFetchDoneDelta = (data: TFetchResponse): IAuthFetchDoneAction =>
  ({ type: ActionTypeAuth.FETCH_DONE, payload: data });
const authDataLoginDoneDelta = (data: TFetchResponse): IAuthLoginDoneAction =>
  ({ type: ActionTypeAuth.LOGIN_DONE, payload: data });
const authDataUpdateDoneDelta = (data: TFetchResponse): IAuthUpdateDoneAction =>
  ({ type: ActionTypeAuth.UPDATE_DONE, payload: data });
const authDataLogoutDoneDelta = (): IAuthLogoutDoneAction => ({ type: ActionTypeAuth.LOGOUT_DONE });

/* Signals */
interface IAuthDataGet {
  (): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
const authDataGetSignal: IAuthDataGet = () => dispatch => Promise.coroutine(function* getAuth() {
  const answer = yield dispatch(fetchSignal(URL));

  if (answer.isSuccess) {
    dispatch(authDataFetchDoneDelta(answer.data));
  }

  return answer;
})();

interface IAuthDataGetWithNoErrors {
  (): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
const authDataGetWithNoErrorsSignal: IAuthDataGetWithNoErrors = () => dispatch =>
  Promise.coroutine(function* getAuth() {
    const answer = yield dispatch(fetchSignal(URL, { silent: true }));

    if (answer.isSuccess) {
      dispatch(authDataFetchDoneDelta(answer.data));
    }

    return answer;
  })();

interface IAuthDataLogin {
  (options: { data: { login: string, password: string } }): (dispatch: Dispatch<any>) =>
    Promise<TFetchResult>;
}
const authDataLoginSignal: IAuthDataLogin = ({ data }) => dispatch =>
  Promise.coroutine(function* postAuth() {
    data.password = getHashedPassword(data.password); // eslint-disable-line no-param-reassign

    const answer = yield dispatch(fetchSignal(URL, { method: 'POST', body: data, silent: true }));

    if (answer.isSuccess) {
      dispatch(authDataLoginDoneDelta(answer.data));
    }

    return answer;
  })();

interface IAuthDataUpdate {
  (body: object): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
const authDataUpdateSignal: IAuthDataUpdate = body => dispatch =>
  Promise.coroutine(function* updateAuth() {
    const answer = yield dispatch(fetchSignal(URL, { method: 'PATCH', body }));

    if (answer.isSuccess) {
      dispatch(authDataUpdateDoneDelta(answer.data));
    }

    return answer;
  })();

interface IAuthDataLogout {
  (): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
const authDataLogoutSignal: IAuthDataLogout = () => dispatch =>
  Promise.coroutine(function* deleteAuth() {
    const answer = yield dispatch(fetchSignal(URL, { method: 'DELETE' }));

    if (answer.isSuccess) {
      dispatch(authDataLogoutDoneDelta());
    }

    return answer;
  })();

interface IAuthDataLogoutAll {
  (): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
const authDataLogoutAllSignal: IAuthDataLogoutAll = () => dispatch =>
  Promise.coroutine(function* deleteAuthAll() {
    const answer = yield dispatch(fetchSignal(`${URL}?all=1`, { method: 'DELETE' }));

    if (answer.isSuccess) {
      dispatch(authDataLogoutDoneDelta());
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

// State
interface IStateDataFactory {
  id: boolean | number;
  name: boolean | string;
  login: boolean | string;
  role: boolean | string;
  email: boolean | string;
  language: string;
}
const StateDataFactory = Record<IStateDataFactory>({
  id: false,
  name: false,
  login: false,
  role: false,
  email: false,
  language: window.localStorage.getItem('language') || 'en',
});

const stateData = new StateDataFactory();

interface IStateFactory {
  data: typeof stateData;
}
const StateFactory = Record<IStateFactory>({ data: stateData });

const initialState = new StateFactory();
export type TState = typeof initialState;

/*
* Reducer
* */
const reducer: Reducer<TState> = (state = initialState, action: TActions) => {
  switch (action.type) {
    case ActionTypeAuth.FETCH_DONE:
    case ActionTypeAuth.LOGIN_DONE: {
      const { language } = state.data;
      const data = Object.assign({ language }, action.payload);

      return state.set('data', new StateDataFactory(data));
    }

    case ActionTypeAuth.SET_LANGUAGE: {
      window.localStorage.setItem('language', action.payload);
      window.location.reload();

      return state;
    }

    case ActionTypeAuth.UPDATE_DONE: {
      return state.update('data', data => data.merge(action.payload));
    }

    case ActionTypeAuth.LOGOUT_DONE:
    case ActionTypeAuth.RESET:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
