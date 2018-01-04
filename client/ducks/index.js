import { combineReducers } from 'redux';
import componentsReducer from './components';
import dataReducer from './data';

const rootReducer = combineReducers({
  components: componentsReducer,
  data: dataReducer,
});

export default rootReducer;
