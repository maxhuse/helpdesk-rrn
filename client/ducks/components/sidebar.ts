import { Record } from 'immutable';
import { Reducer } from 'redux';

// Action types
enum ActionTypeSidebar {
  TOGGLE_ON_MOBILE = 'sidebar-component/TOGGLE_ON_MOBILE',
}

/*
* Actions
* */
interface ISidebarToggleAction {
  readonly type: ActionTypeSidebar.TOGGLE_ON_MOBILE;
}
const sidebarComponentToggleDelta = (): ISidebarToggleAction =>
  ({ type: ActionTypeSidebar.TOGGLE_ON_MOBILE });

type TActions = ISidebarToggleAction;

// all actions
export const actions = {
  sidebarComponentToggleDelta,
};

/*
* Reducer
* */
interface IStateFactory {
  isShownOnMobile: boolean;
}
const StateFactory = Record<IStateFactory>({ isShownOnMobile: false });

const initialState = new StateFactory();
export type TState = typeof initialState;

const reducer: Reducer<TState> = (state = initialState, action: TActions) => {
  switch (action.type) {
    case ActionTypeSidebar.TOGGLE_ON_MOBILE:
      return state.set('isShownOnMobile', !state.isShownOnMobile);

    default:
      return state;
  }
};

export default reducer;
