import i18next from 'i18next';
import { Dispatch } from 'redux';
import { actions as authDataActions } from 'ducks/data/auth';
import { actions as toastsComponentActions } from 'ducks/components/toasts';
import { actions as modalComponentActions } from 'ducks/components/modal';
import browserHistory from 'browser-history';

export type TErrorResult = { status?: number, data: object, originalData: object, error?: Error };
/* eslint-disable indent */
interface IErrorHandler {
  (
    dispatch: Dispatch<any>,
    options: {
      status?: number,
      data?: { message?: string, arguments?: object },
      error?: Error,
      method: string,
      isAborted?: boolean,
      options: {
        method?: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE',
        body?: object,
        silent?: boolean,
      }
    }
  ): TErrorResult;
}
/* eslint-enable indent */

const errorHandler: IErrorHandler =
(dispatch, { status, data = {}, error, method, isAborted, options }) => {
  // Ignore aborts and silent
  if (isAborted || options.silent) {
    return {
      status,
      data,
      originalData: data,
      error,
    };
  }

  switch (status) {
    case 401:
    case 403: {
      // Redirect to authorization page
      browserHistory.push('/auth');
      dispatch(authDataActions.authDataResetDelta());
      dispatch(modalComponentActions.modalComponentHideAllSignal());

      return {
        status,
        data,
        originalData: data,
        error,
      };
    }

    default: {
      if (method !== 'GET') {
        dispatch(toastsComponentActions.toastsComponentAddDelta({
          type: 'error',
          content: i18next.t(data.message || 'server.unknown_error', data.arguments),
        }));
      }

      return {
        status,
        data,
        originalData: data,
        error,
      };
    }
  }
};

export default errorHandler;
