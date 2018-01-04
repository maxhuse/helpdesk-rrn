import { combineReducers } from 'redux';
import sidebarComponentIm from './sidebar';
import modalComponentIm from './modal';
import tableComponentIm from './table';
import toastsComponentIm from './toasts';
import pagesReducer from './pages';

const componentsReducer = combineReducers({
  sidebarComponentIm,
  modalComponentIm,
  tableComponentIm,
  toastsComponentIm,
  pages: pagesReducer,
});

export default componentsReducer;
