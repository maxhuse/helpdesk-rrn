import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import routes from 'routes';
import browserHistory from 'browser-history';

const Root = ({ store }) => (
  <Provider store={store} key="provider">
    <Router history={browserHistory}>{routes}</Router>
  </Provider>
);

export default Root;
