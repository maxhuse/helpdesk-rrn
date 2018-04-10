import { Store } from 'redux';

type IConfigureStor = (initialState?: any) => Store<any>;
// eslint-disable-next-line import/no-mutable-exports
let configureStore: IConfigureStor;

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  configureStore = require('./configure-store.prod').default;
} else {
  // eslint-disable-next-line global-require
  configureStore = require('./configure-store.dev').default;
}

export default configureStore;
