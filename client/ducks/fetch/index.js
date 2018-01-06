/*
* Module for working with rest server: loads data, parse json, handles errors.
* */
import ajax from './ajax';
import successHandler from './success-handler';
import errorHandler from './error-handler';

/*
* Constants
* */

export const MODULE_NAME = 'ajax';

/*
* Actions
* */

export const fetchSignal = (url, options = {}) => (dispatch, getState) => {
  const method = options.method || 'GET';

  return ajax(url, options).then(({ status, data, error, isAborted }) => {
    if (status === 200) {
      // Apply a handler for successful ajax requests
      return Promise.coroutine(successHandler.bind(
        null,
        dispatch,
        { status, data, url, method, options }
      ))();
    }

    // Apply a handler for error ajax requests
    return Promise.coroutine(errorHandler.bind(
      null,
      dispatch,
      { status, data, url, method, options, error, isAborted, getState }
    ))();
  });
};

export const actions = { fetchSignal };
