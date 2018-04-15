import { List, Record } from 'immutable';
import { Reducer, Dispatch } from 'redux';
import Promise from 'bluebird';
import { actions as toastsComponentActions } from 'ducks/components/toasts';
import { actions as tableComponentActions } from 'ducks/components/table';
import { TFetchResult } from 'ducks/fetch';

// Action names
enum ActionTypeModal {
  SHOW = 'modal-component/SHOW',
  CLOSE = 'modal-component/CLOSE',
  CLOSE_ALL = 'modal-component/CLOSE_ALL',
  DISABLE = 'modal-component/DISABLE',
  ENABLE = 'modal-component/ENABLE',
}

/*
* Actions
* */
type TShowOptions = { [key: string]: any } | false;
type TShowPayload = { id: string, options: TShowOptions };
interface IModalShowAction {
  readonly type: ActionTypeModal.SHOW;
  readonly payload: TShowPayload;
}
const modalComponentShowDelta = (id: string, options: TShowOptions): IModalShowAction =>
  ({ type: ActionTypeModal.SHOW, payload: { id, options } });

interface IModalDisableAction {
  readonly type: ActionTypeModal.DISABLE;
}
const modalComponentDisableDelta = (): IModalDisableAction => ({ type: ActionTypeModal.DISABLE });

interface IModalEnableAction {
  readonly type: ActionTypeModal.ENABLE;
}
const modalComponentEnableDelta = (): IModalEnableAction => ({ type: ActionTypeModal.ENABLE });

interface IModalCloseAction {
  readonly type: ActionTypeModal.CLOSE;
}
const modalComponentCloseDelta = (): IModalCloseAction => ({ type: ActionTypeModal.CLOSE });

interface IModalCloseAllAction {
  readonly type: ActionTypeModal.CLOSE_ALL;
}
const modalComponentCloseAllDelta = (): IModalCloseAllAction =>
  ({ type: ActionTypeModal.CLOSE_ALL });

type TActions = IModalShowAction |
  IModalDisableAction |
  IModalEnableAction |
  IModalCloseAction |
  IModalCloseAllAction;


interface IModalShow {
  (id: string, options: TShowOptions): (dispatch: Dispatch<any>) => void;
}
const modalComponentShowSignal: IModalShow = (id, options) => (dispatch) => {
  // Lock table rows and show modal
  dispatch(tableComponentActions.tableComponentToggleRowsLockedDelta(true));
  dispatch(modalComponentShowDelta(id, options));
};

interface IModalHide {
  (): (dispatch: Dispatch<any>) => void;
}
// Must be async to lock opened table row
const modalComponentHideSignal: IModalHide = () => (dispatch) => {
  window.setTimeout(() => {
    // Close modal and unlock table rows
    dispatch(modalComponentCloseDelta());
    dispatch(tableComponentActions.tableComponentToggleRowsLockedDelta(false));
  }, 10);
};

interface IModalHideAll {
  (): (dispatch: Dispatch<any>) => void;
}
// Must be async to lock opened table row
const modalComponentHideAllSignal: IModalHideAll = () => (dispatch) => {
  window.setTimeout(() => {
    // Close modal and unlock table rows
    dispatch(modalComponentCloseAllDelta());
    dispatch(tableComponentActions.tableComponentToggleRowsLockedDelta(false));
  }, 10);
};

/* eslint-disable indent */
interface IModalSubmitWrapper {
  (options: {
    submitSignal: () => Promise<TFetchResult>,
    doneText: string | false,
  }): (dispatch: Dispatch<any>) => Promise<TFetchResult>;
}
/* eslint-enable indent */

// Wrap submitSignal with logic of button disable and toast display on success
const modalComponentSubmitWrapperSignal: IModalSubmitWrapper =
  ({ submitSignal, doneText = false }) => dispatch => Promise.coroutine(function* getWrapper() {
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
  modalComponentShowSignal,
  modalComponentHideSignal,
  modalComponentHideAllSignal,
  modalComponentSubmitWrapperSignal,
};

// State
interface IQueueItemFactory {
  activeId: false | string | number;
  options: false | { [key: string]: any };
}
const QueueItemFactory = Record<IQueueItemFactory>({ activeId: false, options: false });
// Temporary item for getting QueueItem type
const tempQueueItem = new QueueItemFactory();

interface IStateFactory {
  activeId: false | string | number;
  isDisabled: boolean;
  options: false | { [key: string]: any };
  queue: List<typeof tempQueueItem>;
  data: false | { [key: string]: any };
}
const StateFactory = Record<IStateFactory>({
  activeId: false,
  isDisabled: false,
  options: false,
  queue: List(),
  data: false,
});

const initialState = new StateFactory();
export type TState = typeof initialState;

/*
* Reducer
* */
const reducer: Reducer<TState> = (state = initialState, action: TActions) => {
  switch (action.type) {
    case ActionTypeModal.SHOW:
      return state.withMutations((mutable) => {
        mutable.set('activeId', action.payload.id)
          .set('options', action.payload.options)
          .set('queue', state.queue.push(
            new QueueItemFactory({
              activeId: action.payload.id,
              options: action.payload.options,
            })
          ));
      });

    case ActionTypeModal.ENABLE:
      return state.set('isDisabled', false);

    case ActionTypeModal.DISABLE:
      return state.set('isDisabled', true);

    case ActionTypeModal.CLOSE: {
      if (state.queue.size > 1) {
        return state.withMutations((mutable) => {
          const queue = state.queue.pop();
          const activeDialog = queue.last();

          if (!activeDialog) {
            return;
          }

          mutable
            .set('activeId', activeDialog.activeId)
            .set('queue', queue)
            .set('options', activeDialog.options);
        });
      }

      return initialState;
    }

    case ActionTypeModal.CLOSE_ALL:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
