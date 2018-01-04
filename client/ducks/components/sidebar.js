import { Map } from 'immutable';
import { applicationName } from 'config';

/*
* Constants
* */

export const MODULE_NAME = 'sidebar-component';

// Action types
const TOGGLE_ON_MOBILE = `${applicationName}/${MODULE_NAME}/TOGGLE_ON_MOBILE`;

/*
* Reducer
* */

const initialState = Map({
  isShownOnMobile: false,
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_ON_MOBILE:
      return state.set('isShownOnMobile', !state.get('isShownOnMobile'));

    default:
      return state;
  }
}

/*
* Actions
* */

const sidebarComponentToggleDelta = () => ({ type: TOGGLE_ON_MOBILE });

// all actions
export const actions = {
  sidebarComponentToggleDelta,
};
