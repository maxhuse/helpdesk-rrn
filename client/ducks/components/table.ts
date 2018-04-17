import { Map, Record } from 'immutable';
import { ITEMS_PER_PAGE_OPTIONS, sortOrder, sortType } from 'client-constants';
import { Reducer, Dispatch } from 'redux';

export type TSort = Map<string, string>;
export type TFilters = Map<string, boolean | string>;

type TSortArguments = { field: string, type: sortType, order: sortOrder };

// Action types
enum ActionTypeTable {
  OPEN_ROW = 'table-component/OPEN_ROW',
  CLOSE_ROW = 'table-component/CLOSE_ROW',
  CHANGE_PAGE = 'table-component/CHANGE_PAGE',
  CHANGE_FILTERS = 'table-component/CHANGE_FILTERS',
  RESET_FILTERS = 'table-component/RESET_FILTERS',
  RESET = 'table-component/RESET',
  CHANGE_ITEMS_PER_PAGE = 'table-component/CHANGE_ITEMS_PER_PAGE',
  SORT_CHANGE = 'table-component/SORT_CHANGE',
  TOGGLE_ROWS_LOCKED = 'table-component/TOGGLE_ROWS_LOCKED',
}

/*
* Actions
* */
interface IOpenRow {
  readonly type: ActionTypeTable.OPEN_ROW;
  readonly payload: number;
}
const tableComponentOpenRowDelta = (id: number): IOpenRow =>
  ({ type: ActionTypeTable.OPEN_ROW, payload: id });

interface ICloseRow {
  readonly type: ActionTypeTable.CLOSE_ROW;
}
const tableComponentCloseRowDelta = (): ICloseRow => ({ type: ActionTypeTable.CLOSE_ROW });

interface IChangePage {
  readonly type: ActionTypeTable.CHANGE_PAGE;
  readonly payload: number;
}
const tableComponentChangePageDelta = (page: number): IChangePage =>
  ({ type: ActionTypeTable.CHANGE_PAGE, payload: page });

interface IChangeFilters {
  readonly type: ActionTypeTable.CHANGE_FILTERS;
  readonly payload: Map<string, boolean | string>;
}
const tableComponentChangeFiltersDelta = (filters: TFilters): IChangeFilters =>
  ({ type: ActionTypeTable.CHANGE_FILTERS, payload: filters });

interface IResetFilters {
  readonly type: ActionTypeTable.RESET_FILTERS;
}
const tableComponentResetFiltersDelta = (): IResetFilters =>
  ({ type: ActionTypeTable.RESET_FILTERS });

interface IReset {
  readonly type: ActionTypeTable.RESET;
}
const tableComponentResetDelta = (): IReset => ({ type: ActionTypeTable.RESET });

interface IChangeItemsPerPage {
  readonly type: ActionTypeTable.CHANGE_ITEMS_PER_PAGE;
  readonly payload: number;
}
const tableComponentChangeItemsPerPageDelta = (itemsPerPage: number): IChangeItemsPerPage =>
  ({ type: ActionTypeTable.CHANGE_ITEMS_PER_PAGE, payload: itemsPerPage });

interface ISortChangeInner {
  readonly type: ActionTypeTable.SORT_CHANGE;
  readonly payload: TSortArguments;
}
const tableComponentSortChangeInnerDelta = (sort: TSortArguments): ISortChangeInner =>
  ({ type: ActionTypeTable.SORT_CHANGE, payload: sort });

interface IToggleRowsLocked {
  readonly type: ActionTypeTable.TOGGLE_ROWS_LOCKED;
  readonly payload: boolean;
}
const tableComponentToggleRowsLockedDelta = (isLocked: boolean): IToggleRowsLocked =>
  ({ type: ActionTypeTable.TOGGLE_ROWS_LOCKED, payload: isLocked });

interface ISortChange {
  (sort: TSortArguments): (dispatch: Dispatch<any>) => void;
}
const tableComponentSortChangeSignal: ISortChange = sort => (dispatch) => {
  dispatch(tableComponentCloseRowDelta());
  dispatch(tableComponentSortChangeInnerDelta(sort));
};

type TActions = IOpenRow |
  ICloseRow |
  IChangePage |
  IChangeFilters |
  IResetFilters |
  IReset |
  IChangeItemsPerPage |
  ISortChangeInner |
  IToggleRowsLocked;

// all actions
export const actions = {
  tableComponentOpenRowDelta,
  tableComponentCloseRowDelta,
  tableComponentChangePageDelta,
  tableComponentChangeFiltersDelta,
  tableComponentResetFiltersDelta,
  tableComponentResetDelta,
  tableComponentChangeItemsPerPageDelta,
  tableComponentToggleRowsLockedDelta,
  tableComponentSortChangeSignal,
};

/* State */
interface IStateFactory {
  openedId: false | number;
  page: number;
  itemsPerPage: number;
  filters: TFilters;
  sort: TSort;
  isRowsLocked: boolean;
}
const StateFactory = Record<IStateFactory>({
  // id of an opened row
  openedId: false,
  // Current page in the table
  page: 1,
  // How many rows are displayed on the page
  itemsPerPage: ITEMS_PER_PAGE_OPTIONS.get(0, 10),
  filters: Map(),
  sort: Map(),
  // Lock the closing of the expanded row. This is necessary at opening of a modal window.
  isRowsLocked: false,
});

const initialState = new StateFactory();

export type TState = typeof initialState;

/*
* Reducer
* */
const reducer: Reducer<TState> = (state = initialState, action: TActions) => {
  switch (action.type) {
    case ActionTypeTable.OPEN_ROW: {
      return state.set('openedId', action.payload);
    }

    case ActionTypeTable.CLOSE_ROW: {
      return state.set('openedId', false);
    }

    case ActionTypeTable.CHANGE_PAGE: {
      return state.withMutations((mutable) => {
        mutable.set('page', action.payload)
          .set('openedId', initialState.openedId);
      });
    }

    case ActionTypeTable.CHANGE_FILTERS: {
      return state.withMutations((mutable) => {
        mutable.set('filters', Map(action.payload))
          .set('page', initialState.page)
          .set('openedId', initialState.openedId);
      });
    }

    case ActionTypeTable.RESET_FILTERS: {
      return state.withMutations((mutable) => {
        mutable.set('filters', initialState.filters)
          .set('page', initialState.page)
          .set('openedId', initialState.openedId);
      });
    }

    case ActionTypeTable.RESET: {
      return initialState;
    }

    case ActionTypeTable.CHANGE_ITEMS_PER_PAGE: {
      return state.withMutations((mutable) => {
        mutable.set('itemsPerPage', action.payload)
          .set('page', initialState.page);
      });
    }

    case ActionTypeTable.SORT_CHANGE: {
      return state.set('sort', Map(action.payload));
    }

    case ActionTypeTable.TOGGLE_ROWS_LOCKED: {
      return state.set('isRowsLocked', action.payload);
    }

    default: {
      return state;
    }
  }
};

export default reducer;
