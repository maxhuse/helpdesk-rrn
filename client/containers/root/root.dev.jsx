import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import routes from 'routes';
import browserHistory from 'browser-history';
import createDevToolsWindow from 'tools/create-dev-tools-window';

const Root = ({ store }) => {
  createDevToolsWindow(store);

  return (
    <Provider store={store} key="provider">
      <Router history={browserHistory}>{routes}</Router>
    </Provider>
  );
};

export default Root;
