import { List, Record } from 'immutable';
import { Reducer } from 'redux';

// Action types
enum ActionTypeToast {
  ADD = 'toasts-component/ADD',
  DELETE = 'toasts-component/DELETE',
  RESET = 'toasts-component/RESET',
}

/*
* Actions
* */
type TAddPayload = { type: string, content: string };
interface IToastAddAction {
  readonly type: ActionTypeToast.ADD;
  readonly payload: TAddPayload;
}
interface IToastDeleteAction {
  readonly type: ActionTypeToast.DELETE;
  readonly payload: number;
}
interface IToastResetAction {
  readonly type: ActionTypeToast.RESET;
}
type TActions = IToastAddAction | IToastDeleteAction | IToastResetAction;

export const toastsComponentAddDelta = (toastData: TAddPayload): IToastAddAction =>
  ({ type: ActionTypeToast.ADD, payload: toastData });
export const toastsComponentDeleteDelta = (id: number): IToastDeleteAction =>
  ({ type: ActionTypeToast.DELETE, payload: id });
export const toastsComponentResetDelta = (): IToastResetAction => ({ type: ActionTypeToast.RESET });

// All actions
export const actions = {
  toastsComponentAddDelta,
  toastsComponentDeleteDelta,
  toastsComponentResetDelta,
};

// State
interface IToastItemFactory {
  id: number;
  type: string;
  content: string;
}
const ToastItemFactory = Record<IToastItemFactory>({ id: 0, type: '', content: '' });
// Temporary item for getting ToastItem type
const tempToastItem = new ToastItemFactory();

interface IStateFactory {
  nextId: number;
  items: List<typeof tempToastItem>;
}
const StateFactory = Record<IStateFactory>({ nextId: 0, items: List() });

const initialState = new StateFactory();
export type TState = typeof initialState;

/*
* Reducer
* */
const reducer: Reducer<TState> = (state = initialState, action: TActions) => {
  switch (action.type) {
    case ActionTypeToast.ADD: {
      return state.withMutations((mutable) => {
        const { nextId } = state;
        const items = state.items.push(new ToastItemFactory({
          id: nextId,
          type: action.payload.type,
          content: action.payload.content,
        }));

        mutable.set('items', items).set('nextId', nextId + 1);
      });
    }

    case ActionTypeToast.DELETE: {
      const index = state.items.findIndex(toast => toast.id === action.payload);

      return state.set('items', state.items.delete(index));
    }

    case ActionTypeToast.RESET: {
      return initialState;
    }

    default:
      return state;
  }
};

export default reducer;
