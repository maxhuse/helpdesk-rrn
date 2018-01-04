import i18next from 'i18next';
import { Map } from 'immutable';
import { applicationName } from 'config';
import { actions as authDataActions } from 'ducks/data/auth';
import { actions as toastsComponentActions } from 'ducks/components/toasts';

/*
* Constants
* */

export const MODULE_NAME = 'profile-page';

// Action names
const SET_OPENED_NAME = `${applicationName}/${MODULE_NAME}/SET_OPENED_NAME`;
const TOGGLE_BLOCKED = `${applicationName}/${MODULE_NAME}/TOGGLE_BLOCKED`;
const RESET = `${applicationName}/${MODULE_NAME}/RESET`;

/*
* Reducer
* */

const initialState = Map({
  isBlocked: false,
  openedInlineEditName: '',
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_OPENED_NAME:
      return state.set('openedInlineEditName', action.payload);

    case TOGGLE_BLOCKED:
      return state.set('isBlocked', action.payload);

    case RESET:
      return initialState;

    default:
      return state;
  }
}

/*
* Actions
* */

const profilePageSetOpenedNameDelta = ({ name }) => ({ type: SET_OPENED_NAME, payload: name });
const profilePageResetDelta = () => ({ type: RESET });
const profilePageToggleBlockedDelta = state => ({ type: TOGGLE_BLOCKED, payload: state });

const profilePageUpdateSignal = ({ data }) =>
  dispatch => Promise.coroutine(function* updateProfile() {
    dispatch(profilePageToggleBlockedDelta(true));

    const answer = yield dispatch(authDataActions.authDataUpdateSignal(data));

    dispatch(profilePageToggleBlockedDelta(false));
    dispatch(profilePageSetOpenedNameDelta({ name: '' }));

    if (answer.isSuccess) {
      dispatch(
        toastsComponentActions.toastsComponentAddDelta({
          type: 'info',
          content: i18next.t('profile_updated')
        })
      );
    }

    return answer;
  })();

export const actions = {
  profilePageSetOpenedNameDelta,
  profilePageToggleBlockedDelta,
  profilePageResetDelta,
  profilePageUpdateSignal,
};
