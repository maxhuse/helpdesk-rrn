import { Map, List } from 'immutable';
import { applicationName } from 'config';
import { actions as toastsComponentActions } from 'ducks/components/toasts';
import { actions as tableComponentActions } from 'ducks/components/table';

/*
* Constants
* */

export const MODULE_NAME = 'modal-component';

// Action names
const SHOW = `${applicationName}/${MODULE_NAME}/SHOW`;
const CLOSE = `${applicationName}/${MODULE_NAME}/CLOSE`;
const CLOSE_ALL = `${applicationName}/${MODULE_NAME}/CLOSE_ALL`;
const DISABLE = `${applicationName}/${MODULE_NAME}/DISABLE`;
const ENABLE = `${applicationName}/${MODULE_NAME}/ENABLE`;

/*
* Reducer
* */

const initialState = Map({
  activeId: false,
  isDisabled: false,
  options: false,
  queue: List(),
  data: false,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW:
      return state.withMutations((mutable) => {
        mutable.set('activeId', action.payload.id)
          .set('options', action.payload.options)
          .set('queue', state.get('queue').push(
            Map({
              activeId: action.payload.id,
              options: action.payload.options,
            })
          ));
      });

    case ENABLE:
      return state.set('isDisabled', false);

    case DISABLE:
      return state.set('isDisabled', true);

    case CLOSE: {
      if (state.get('queue').size > 1) {
        return state.withMutations((mutable) => {
          const queue = state.get('queue').pop();
          const activeDialog = queue.last();

          mutable
            .set('activeId', activeDialog.get('activeId'))
            .set('queue', queue)
            .set('options', activeDialog.get('options'));
        });
      }

      return initialState;
    }

    case CLOSE_ALL:
      return initialState;

    default:
      return state;
  }
}

/*
* Actions
* */

const modalComponentShowDelta = (id, options) => (dispatch) => {
  // Lock table rows and show modal
  dispatch(tableComponentActions.tableComponentToggleRowsLockedDelta(true));
  dispatch({ type: SHOW, payload: { id, options } });
};

const modalComponentDisableDelta = () => ({ type: DISABLE });
const modalComponentEnableDelta = () => ({ type: ENABLE });

// Must be async to lock opened table row
const modalComponentHideSignal = () => (dispatch) => {
  setTimeout(() => {
    // Close modal and unlock table rows
    dispatch({ type: CLOSE });
    dispatch(tableComponentActions.tableComponentToggleRowsLockedDelta(false));
  }, 10);
};

// Must be async to lock opened table row
const modalComponentHideAllSignal = () => (dispatch) => {
  setTimeout(() => {
    // Close modal and unlock table rows
    dispatch({ type: CLOSE_ALL });
    dispatch(tableComponentActions.tableComponentToggleRowsLockedDelta(false));
  }, 10);
};

// Wrap submitSignal with logic of button disable and toast display on success
const modalComponentSubmitWrapperSignal = ({ submitSignal, doneText = false }) =>
  dispatch => Promise.coroutine(function* getWrapper() {
    dispatch(modalComponentDisableDelta());

    const answer = yield submitSignal();

    if (answer.isSuccess) {
      if (doneText) {
        dispatch(
          toastsComponentActions.toastsComponentAddDelta({ type: 'info', content: doneText })
        );
      }

      dispatch(modalComponentHideSignal());
    }

    dispatch(modalComponentEnableDelta());

    return answer;
  })();

export const actions = {
  modalComponentShowDelta,
  modalComponentDisableDelta,
  modalComponentEnableDelta,
  modalComponentHideSignal,
  modalComponentHideAllSignal,
  modalComponentSubmitWrapperSignal,
};
