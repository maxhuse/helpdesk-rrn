import { fromJS, Map } from 'immutable';
import { applicationName } from 'config';

/*
* Constants
* */

export const MODULE_NAME = 'toasts-component';

// Action types
const ADD = `${applicationName}/${MODULE_NAME}/ADD`;
const DELETE = `${applicationName}/${MODULE_NAME}/DELETE`;
const RESET = `${applicationName}/${MODULE_NAME}/RESET`;

/*
* Reducer
* */

export const initialState = fromJS({
  nextId: 0,
  items: [],
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD: {
      return state.withMutations((mutable) => {
        const nextId = state.get('nextId');
        const items = state.get('items')
          .push(Map({
            id: nextId,
            type: action.payload.type,
            content: action.payload.content,
          }));

        mutable.set('items', items).set('nextId', nextId + 1);
      });
    }

    case DELETE: {
      const index = state.get('items')
        .findIndex(toast => toast.get('id') === action.payload);

      return state.set('items', state.get('items').delete(index));
    }

    case RESET: {
      return initialState;
    }

    default:
      return state;
  }
}

/*
* Actions
* */

export const toastsComponentAddDelta = toastData => ({ type: ADD, payload: toastData });
export const toastsComponentDeleteDelta = id => ({ type: DELETE, payload: id });
export const toastsComponentResetDelta = () => ({ type: RESET });

// all actions
export const actions = {
  toastsComponentAddDelta,
  toastsComponentDeleteDelta,
  toastsComponentResetDelta,
};
