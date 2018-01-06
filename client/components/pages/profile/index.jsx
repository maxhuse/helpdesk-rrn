import React, { PureComponent } from 'react';
import i18next from 'i18next';
import { VALID_EMAIL_REX } from 'shared/constants';
import ModalChangePassword from 'components/modal/change-password';
import Modal from 'containers/modal';
import InlineEdit from 'components/inline-edit';
import ModalTerminateSessions from './modal-terminate-sessions';

const ProfileSecurityCard = ({ onClickTerminate }) => (
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

export default class Profile extends PureComponent {
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

  onInlineEditSubmit({ name, value }) {
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

  onClickTerminateAllSessions() {
    return this.props.authDataLogoutAllSignal().then(
      () => this.props.modalComponentHideSignal(),
      () => this.props.modalComponentHideSignal()
    );
  }

  validateLogin(login) {
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

  validateEmail(email) {
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
      modalComponentShowDelta,
    } = this.props;
    const isBlocked = profilePageIm.get('isBlocked');
    const openedInlineEditName = profilePageIm.get('openedInlineEditName');

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
                    onClick={() => modalComponentShowDelta('changePassword', false)}
                  >
                    {i18next.t('change_password')}
                  </button>
                  <Modal modalId="changePassword">
                    <ModalChangePassword
                      userId={false}
                      submitSignal={profilePageUpdateSignal}
                    />
                  </Modal>
                </div>
              </div>
            </div>

            <div className="profile__section profile__section_security">
              <ProfileSecurityCard
                onClickTerminate={() => modalComponentShowDelta('terminateSessions', false)}
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
