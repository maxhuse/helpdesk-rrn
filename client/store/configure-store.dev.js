/* global window */
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistState } from 'redux-devtools';
import rootReducer from 'ducks';
import DevTools from 'containers/dev-tools';

/*
* Creates a preconfigured store.
* */
const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )
  );

  if (module.hot) {
    console.log('It\'s hot!'); // eslint-disable-line no-console

    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../ducks', () => {
      const nextRootReducer = require('../ducks').default; // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
