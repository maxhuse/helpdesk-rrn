import React, { PureComponent } from 'react';
import i18next from 'i18next';
import Input from 'components/input';

export default class AuthForm extends PureComponent {
  get login() {
    return this.loginRef;
  }

  get password() {
    return this.passwordRef;
  }

  render() {
    const { onSubmit } = this.props;

    return (
      <div className="auth">
        <div className="auth__header">
          <div className="auth__title">{i18next.t('helpdesk')}</div>
        </div>

        <form className="auth__form">
          <div className="auth__block">
            <label className="auth__block_name" htmlFor="auth__block_login">
              {i18next.t('login')}
            </label>
            <Input
              id="auth__block_login"
              className="input"
              ref={(ref) => { this.loginRef = ref; }}
              type="text"
              name="login"
            />
          </div>

          <div className="auth__block">
            <label className="auth__block_name" htmlFor="auth__block_password">
              {i18next.t('password')}
            </label>
            <Input
              id="auth__block_password"
              className="input"
              ref={(ref) => { this.passwordRef = ref; }}
              type="password"
              name="password"
            />
          </div>

          <button
            className="button button_raised_green button_login"
            onClick={onSubmit}
          >
            {i18next.t('log_in')}
          </button>
        </form>
      </div>
    );
  }
}
