import { createStore, applyMiddleware, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from 'ducks';

/*
* Creates a preconfigured store.
* */
const configureStore = (initialState?: any): Store<any> => createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware)
);

export default configureStore;
