import { combineReducers } from 'redux';
import componentsReducer from './components';
import dataReducer from './data';

interface IComponentsState {
  components: typeof componentsReducer;
  data: typeof dataReducer;
}

const rootReducer = combineReducers<IComponentsState>({
  components: componentsReducer,
  data: dataReducer,
});

export default rootReducer;
