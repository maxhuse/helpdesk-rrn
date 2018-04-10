import { List, Record } from 'immutable';

// Action types
enum ActionTypeToast {
  ADD = 'toasts-component/ADD',
  DELETE = 'toasts-component/DELETE',
  RESET = 'toasts-component/RESET',
}

export class ToastItem extends Record({ id: 0, type: '', content: '' }) {
  id: number;
  type: string;
  content: string;
}
export class State extends Record({ nextId: 0, items: List() }) {
  nextId: number;
  items: List<ToastItem>;
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

/*
* Reducer
* */
const initialState = new State();

export default function reducer(state: State = initialState, action: TActions): State {
  switch (action.type) {
    case ActionTypeToast.ADD: {
      return state.withMutations((mutable) => {
        const { nextId } = state;
        const items = state.items.push(new ToastItem({
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
}
