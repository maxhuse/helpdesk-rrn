/* global XMLHttpRequest */
import i18next from 'i18next';

/*
* Обертка на xhr, которая никогда не реджектится и
* резолвится объектом вида { status, data, error }
* */

const ajax = (url, options = {}) => new Promise((resolve, reject, onCancel) => {
  const xhr = new XMLHttpRequest();
  const { method = 'GET', body } = options;

  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  xhr.onload = () => {
    resolve({
      status: xhr.status,
      data: JSON.parse(xhr.responseText),
    });
  };

  xhr.onerror = () => {
    resolve({ error: new TypeError(i18next.t('network_request_failed')) });
  };

  xhr.ontimeout = () => {
    resolve({ error: new TypeError(i18next.t('network_request_failed')) });
  };

  xhr.onabort = () => {
    resolve({ error: new TypeError(i18next.t('network_request_failed')), isAborted: true });
  };

  xhr.send(JSON.stringify(body));

  onCancel(() => xhr.abort());
});

export default ajax;

