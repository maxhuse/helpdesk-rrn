/*
* Module for working with rest server: loads data, parse json, handles errors.
* */
import Promise from 'bluebird';
import { Dispatch } from 'redux';
import ajax from './ajax';
import successHandler, { TSuccessResult } from './success-handler';
import errorHandler, { TErrorResult } from './error-handler';

type TFetchResult = Promise<TSuccessResult | TErrorResult>;
interface IFetchDispatch<D> {
  (dispatch: Dispatch<D>): TFetchResult;
}
/* eslint-disable indent */
interface IFetchSignal {
  <T>(
    url: string,
    options?: {
      method?: 'GET'|'PUT'|'POST'|'PATCH'|'DELETE',
      body?: object,
      silent?: boolean,
    }
  ): IFetchDispatch<T>;
}
/* eslint-enable indent */

export const fetchSignal: IFetchSignal = (url, options = {}) => (dispatch) => {
  const method = options.method || 'GET';

  return ajax(url, options).then(({ status, data, error, isAborted }) => {
    if (status === 200) {
      // Apply a handler for successful ajax requests
      return successHandler(dispatch, { status, data });
    }

    // Apply a handler for error ajax requests
    return errorHandler(dispatch, { status, data, method, options, error, isAborted });
  });
};

export const actions = { fetchSignal };
