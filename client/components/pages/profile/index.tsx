import React, { PureComponent, StatelessComponent } from 'react';
import i18next from 'i18next';
import { bindActionCreators, Dispatch } from 'redux';
import Promise from 'bluebird';
import { connect } from 'react-redux';
import {
  actions as profileActions,
  TState as TProfileState
} from 'ducks/components/pages/profile';
import { actions as modalActions } from 'ducks/components/modal';
import { actions as authActions, TState as TAuthState } from 'ducks/data/auth';
import { TFetchResult } from 'ducks/fetch';
import { VALID_EMAIL_REX } from 'shared/constants';
import Modal, { ModalChangePassword } from 'components/modal';
import InlineEdit from 'components/inline-edit';
import ModalTerminateSessions from './modal-terminate-sessions';

const mapDispatchToProps = dispatch => Object.assign(
  {
    dispatch,
    authDataLogoutAllSignal: authActions.authDataLogoutAllSignal,
    profilePageUpdateSignal: profileActions.profilePageUpdateSignal,
  },
  bindActionCreators({
    profilePageResetDelta: profileActions.profilePageResetDelta,
    profilePageSetOpenedNameDelta: profileActions.profilePageSetOpenedNameDelta,
    modalComponentShowSignal: modalActions.modalComponentShowSignal,
    modalComponentHideSignal: modalActions.modalComponentHideSignal,
  }, dispatch)
);

const mapStateToProps = state => ({
  authDataIm: state.data.authDataIm,
  profilePageIm: state.components.pages.profilePageIm,
});

/* Components */
interface ISecureCardProps {
  onClickTerminate: () => void;
}
const ProfileSecurityCard: StatelessComponent<ISecureCardProps> = ({ onClickTerminate }) => (
  <div className="card">
    <h3 className="card__header">{i18next.t('security')}</h3>
    <div className="card__content">
      {i18next.t('terminate_sessions_description')}
    </div>
    <div className="card__buttons">
      <button
        className="button button_flat_blue button_in-card"
        onClick={onClickTerminate}
      >
        {i18next.t('terminate_all_sessions')}
      </button>
    </div>
  </div>
);

interface IProfileProps {
  authDataIm: TAuthState;
  profilePageIm: TProfileState;
  profilePageResetDelta: typeof profileActions.profilePageResetDelta;
  profilePageSetOpenedNameDelta: typeof profileActions.profilePageSetOpenedNameDelta;
  profilePageUpdateSignal: typeof profileActions.profilePageUpdateSignal;
  modalComponentShowSignal: typeof modalActions.modalComponentShowSignal;
  modalComponentHideSignal: typeof modalActions.modalComponentHideSignal;
  authDataLogoutAllSignal: typeof authActions.authDataLogoutAllSignal;
  dispatch: Dispatch<any>;
}
class Profile extends PureComponent<IProfileProps> {
  constructor(props) {
    super(props);

    this.validateLogin = this.validateLogin.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.onInlineEditSubmit = this.onInlineEditSubmit.bind(this);
    this.onClickTerminateAllSessions = this.onClickTerminateAllSessions.bind(this);
  }

  componentWillUnmount() {
    this.props.profilePageResetDelta();
  }

  private onInlineEditSubmit({ name, value }): void {
    const {
      authDataIm,
      profilePageSetOpenedNameDelta,
      profilePageUpdateSignal,
    } = this.props;

    if (authDataIm.getIn(['data', name]) === value) {
      // Value hasn't changed. Close edit.
      profilePageSetOpenedNameDelta({ name: '' });
    } else {
      // Send request to the server
      const data = {};

      data[name] = value;

      profilePageUpdateSignal({ data });
    }
  }

  private onClickTerminateAllSessions(): Promise<TFetchResult> {
    const promise = this.props.dispatch(this.props.authDataLogoutAllSignal());

    promise
      .then(() => this.props.modalComponentHideSignal())
      .catch(() => this.props.modalComponentHideSignal());

    return promise;
  }

  private validateLogin(login: string): false | string {
    const { authDataIm } = this.props;
    const previewsLogin = authDataIm.getIn(['data', 'login']);

    if (!login.length) {
      return i18next.t('v.required');
    }

    if (previewsLogin !== login && login.length < 6) {
      return i18next.t('v.must_be_longer_than', { count: 5 });
    }

    return false;
  }

  private validateEmail(email: string): false | string {
    if (email.length > 0 && !VALID_EMAIL_REX.test(email)) {
      return i18next.t('v.invalid_email');
    }

    return false;
  }

  render() {
    const {
      authDataIm,
      profilePageIm,
      profilePageSetOpenedNameDelta,
      profilePageUpdateSignal,
      modalComponentShowSignal,
      dispatch,
    } = this.props;
    const { isBlocked } = profilePageIm;
    const { openedInlineEditName } = profilePageIm;

    const login = authDataIm.getIn(['data', 'login']);
    const email = authDataIm.getIn(['data', 'email']);

    return (
      <div className="content">
        <div className="content__body">
          <div className="profile">
            <div className="profile__section">
              <div className="card">
                <h3 className="card__header">{i18next.t('personal')}</h3>
                <div className="card__content">
                  <div className="card__content-row">
                    <InlineEdit
                      defaultValue={login}
                      label={i18next.t('login')}
                      placeholder={i18next.t('login')}
                      isBlocked={isBlocked}
                      isEditing={openedInlineEditName === 'login'}
                      name="login"
                      onClickEdit={() => profilePageSetOpenedNameDelta({ name: 'login' })}
                      onSubmit={this.onInlineEditSubmit}
                      closeEditingAction={() => profilePageSetOpenedNameDelta({ name: '' })}
                      validate={this.validateLogin}
                    />
                  </div>
                  <div className="card__content-row">
                    <InlineEdit
                      defaultValue={email}
                      label={i18next.t('email')}
                      placeholder={i18next.t('email')}
                      isBlocked={isBlocked}
                      isEditing={openedInlineEditName === 'email'}
                      name="email"
                      onClickEdit={() => profilePageSetOpenedNameDelta({ name: 'email' })}
                      onSubmit={this.onInlineEditSubmit}
                      closeEditingAction={() => profilePageSetOpenedNameDelta({ name: '' })}
                      validate={this.validateEmail}
                    />
                  </div>
                </div>
                <div className="card__buttons">
                  <button
                    className="button button_flat_blue button_in-card"
                    onClick={() => modalComponentShowSignal('changePassword', false)}
                  >
                    {i18next.t('change_password')}
                  </button>
                  <Modal modalId="changePassword">
                    <ModalChangePassword
                      submitSignal={options => dispatch(profilePageUpdateSignal(options))}
                    />
                  </Modal>
                </div>
              </div>
            </div>

            <div className="profile__section profile__section_security">
              <ProfileSecurityCard
                onClickTerminate={() => modalComponentShowSignal('terminateSessions', false)}
              />

              <Modal modalId="terminateSessions">
                <ModalTerminateSessions submitSignal={this.onClickTerminateAllSessions} />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
