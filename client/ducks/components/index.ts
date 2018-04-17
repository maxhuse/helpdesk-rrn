import { combineReducers } from 'redux';
import sidebarComponentIm, { TState as TSidebarState } from './sidebar';
import modalComponentIm, { TState as TModalState } from './modal';
import tableComponentIm, { TState as TTableState } from './table';
import toastsComponentIm, { TState as TToastsState } from './toasts';
import pagesReducer from './pages';

interface IComponentsState {
  sidebarComponentIm: TSidebarState;
  modalComponentIm: TModalState;
  tableComponentIm: TTableState;
  toastsComponentIm: TToastsState;
  pages: typeof pagesReducer;
}

const componentsReducer = combineReducers<IComponentsState>({
  sidebarComponentIm,
  modalComponentIm,
  tableComponentIm,
  toastsComponentIm,
  pages: pagesReducer,
});

export default componentsReducer;
