import React from 'react';
import { render } from 'react-dom';
import Root from 'containers/root';
import configureStore from 'store/configure-store';
import { AppContainer } from 'react-hot-loader';
import i18next from 'i18next';
import moment from 'moment';
import Promise from 'bluebird';
import 'react-datepicker/dist/react-datepicker.css';
import '../static/scss/app.scss';
import '../static/img/favicon.ico';
import * as languages from '../static/translations';

// Replace native Promise to bluebird
Promise.config({ cancellation: true });

const { en, ru } = languages;

const currentLanguage = window.localStorage.getItem('language') || 'en';

moment.locale(currentLanguage);

const store = configureStore();
const rootElement = document.getElementById('root');

i18next.init({
  lng: currentLanguage,
  compatibilityJSON: 'v2',
  resources: {
    en: {
      translation: en,
    },
    ru: {
      translation: ru,
    },
  },
}, () => {
  // initialized and ready to go!
  // GERONIMO!
  render(
    <AppContainer>
      <Root store={store} />
    </AppContainer>,
    rootElement
  );

  if (module.hot) {
    module.hot.accept('containers/root', () => {
      // eslint-disable-next-line global-require
      const NewRoot = require('containers/root').default;

      render(
        <AppContainer>
          <NewRoot store={store} />
        </AppContainer>,
        rootElement
      );
    });
  }
});
