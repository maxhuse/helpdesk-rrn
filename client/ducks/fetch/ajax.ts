import i18next from 'i18next';
import Promise from 'bluebird';

/*
* A wrapper on xhr that never rejected and resolved with a object { status, data, error, isAborted }
* */

export interface IAjax {
  (url: string, options?: {
  method?: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE',
  body?: object,
  silent?: boolean,
  }): Promise<{ status?: number, data?: object, error?: Error, isAborted?: boolean }>;
}

const ajax: IAjax = (url, options = {}) => new Promise((resolve, reject, onCancel) => {
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

  if (onCancel) {
    onCancel(() => xhr.abort());
  }
});

export default ajax;

