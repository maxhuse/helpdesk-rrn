/*
* Модуль для работы с rest сервером: загружает, парсит json. Обрабатывает ошибки.
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
      // Применим обработчик успешных ajax запросов
      return Promise.coroutine(successHandler.bind(
        null,
        dispatch,
        { status, data, url, method, options }
      ))();
    }

    // Применим обработчик ajax запросов с ошибками
    return Promise.coroutine(errorHandler.bind(
      null,
      dispatch,
      { status, data, url, method, options, error, isAborted, getState }
    ))();
  });
};

export const actions = { fetchSignal };
