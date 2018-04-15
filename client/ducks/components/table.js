import { Map } from 'immutable';
import { ITEMS_PER_PAGE_OPTIONS } from 'client-constants.ts';
import { applicationName } from 'config';

/*
* Constants
* */
const MODULE_NAME = 'table-component';

// action types
const OPEN_ROW = `${applicationName}/${MODULE_NAME}/OPEN_ROW`;
const CLOSE_ROW = `${applicationName}/${MODULE_NAME}/CLOSE_ROW`;
const CHANGE_PAGE = `${applicationName}/${MODULE_NAME}/CHANGE_PAGE`;
const CHANGE_FILTERS = `${applicationName}/${MODULE_NAME}/CHANGE_FILTERS`;
const RESET_FILTERS = `${applicationName}/${MODULE_NAME}/RESET_FILTERS`;
const RESET = `${applicationName}/${MODULE_NAME}/RESET`;
const CHANGE_ITEMS_PER_PAGE = `${applicationName}/${MODULE_NAME}/CHANGE_ITEMS_PER_PAGE`;
const SORT_CHANGE = `${applicationName}/${MODULE_NAME}/SORT_CHANGE`;
const TOGGLE_ROWS_LOCKED = `${applicationName}/${MODULE_NAME}/TOGGLE_ROWS_LOCKED`;

/*
* Reducer
* */

const initialState = Map({
  // id of an opened row
  openedId: false,
  // Current page in the table
  page: 1,
  // How many rows are displayed on the page
  itemsPerPage: ITEMS_PER_PAGE_OPTIONS.get(0),
  filters: Map(),
  sort: Map(),
  // Lock the closing of the expanded row. This is necessary at opening of a modal window.
  isRowsLocked: false,
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN_ROW: {
      return state.set('openedId', action.payload);
    }

    case CLOSE_ROW: {
      return state.set('openedId', false);
    }

    case CHANGE_PAGE: {
      return state.withMutations((mutable) => {
        mutable.set('page', action.payload)
          .set('openedId', initialState.get('openedId'));
      });
    }

    case CHANGE_FILTERS: {
      return state.withMutations((mutable) => {
        mutable.set('filters', Map(action.payload))
          .set('page', initialState.get('page'))
          .set('openedId', initialState.get('openedId'));
      });
    }

    case RESET_FILTERS: {
      return state.withMutations((mutable) => {
        mutable.set('filters', initialState.get('filters'))
          .set('page', initialState.get('page'))
          .set('openedId', initialState.get('openedId'));
      });
    }

    case RESET: {
      return initialState;
    }

    case CHANGE_ITEMS_PER_PAGE: {
      return state.withMutations((mutable) => {
        mutable.set('itemsPerPage', action.payload)
          .set('page', initialState.get('page'));
      });
    }

    case SORT_CHANGE: {
      return state.set('sort', Map(action.payload));
    }

    case TOGGLE_ROWS_LOCKED: {
      return state.set('isRowsLocked', action.payload);
    }

    default: {
      return state;
    }
  }
}

/*
* Actions
* */

const tableComponentOpenRowDelta = id => ({ type: OPEN_ROW, payload: id });
const tableComponentCloseRowDelta = () => ({ type: CLOSE_ROW });
const tableComponentChangePageDelta = page => ({ type: CHANGE_PAGE, payload: page });
const tableComponentChangeFiltersDelta = filters => ({ type: CHANGE_FILTERS, payload: filters });
const tableComponentResetFiltersDelta = () => ({ type: RESET_FILTERS });
const tableComponentResetDelta = () => ({ type: RESET });
const tableComponentChangeItemsPerPageDelta = itemsPerPage => ({
  type: CHANGE_ITEMS_PER_PAGE,
  payload: itemsPerPage,
});

const tableComponentSortChangeInnerDelta = sort => ({ type: SORT_CHANGE, payload: sort });

const tableComponentSortChangeDelta = sort => (dispatch) => {
  dispatch(tableComponentCloseRowDelta());
  dispatch(tableComponentSortChangeInnerDelta(sort));
};

const tableComponentToggleRowsLockedDelta = isLocked =>
  ({ type: TOGGLE_ROWS_LOCKED, payload: isLocked });

// all actions
export const actions = {
  tableComponentOpenRowDelta,
  tableComponentCloseRowDelta,
  tableComponentChangePageDelta,
  tableComponentChangeFiltersDelta,
  tableComponentResetFiltersDelta,
  tableComponentResetDelta,
  tableComponentChangeItemsPerPageDelta,
  tableComponentSortChangeDelta,
  tableComponentToggleRowsLockedDelta,
};
