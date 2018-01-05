import i18next from 'i18next';
import { actions as authDataActions } from 'ducks/data/auth';
import { actions as toastsComponentActions } from 'ducks/components/toasts';
import browserHistory from 'browser-history';

/* eslint-disable require-yield */
function* errorHandler(dispatch, { status, data, error, method, isAborted, options }) {
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
          content: i18next.t(data.message || 'unknown_error'),
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
}

export default errorHandler;
