import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { VALID_EMAIL_REX } from 'shared/constants';
import Input from 'components/input';
import ModalHeader from 'components/modal/modal-header';
import ModalOkCancelButtons from 'components/modal/modal-ok-cancel-buttons';
import { roles } from 'constants.js';

export default class ModalAddCustomer extends PureComponent {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const options = {
      name: this.nameRef.value,
      login: this.loginRef.value,
      password: this.passwordRef.value,
      description: this.descriptionRef.value,
      role: roles.CUSTOMER,
      email: this.emailRef.value,
      active: 1, // new customer is always active
    };

    if (this.validate(options)) {
      this.props.modalComponentSubmitWrapperSignal({
        submitSignal: () => this.props.submitSignal({ data: options }),
        doneText: i18next.t('customer_added', { name: options.name }),
      });
    }
  }

  validate({ login, password, name, email }) {
    let isValid = true;

    // Name
    if (!name.length) {
      this.nameRef.error = i18next.t('v.required');
      isValid = false;
    } else if (name.length < 3) {
      this.nameRef.error = i18next.t('v.must_be_longer_than', { count: 2 });
      isValid = false;
    }

    // Login
    if (!login.length) {
      this.loginRef.error = i18next.t('v.required');
      isValid = false;
    } else if (login.length < 6) {
      this.loginRef.error = i18next.t('v.must_be_longer_than', { count: 5 });
      isValid = false;
    }

    // Password
    if (!password.length) {
      this.passwordRef.error = i18next.t('v.required');
      isValid = false;
    } else if (password.length < 6) {
      this.passwordRef.error = i18next.t('v.must_be_longer_than', { count: 5 });
      isValid = false;
    }


    // Email
    if (email.length > 0 && !VALID_EMAIL_REX.test(email)) {
      this.emailRef.error = i18next.t('v.invalid_email');
      isValid = false;
    }

    return isValid;
  }

  render() {
    const { modalComponentHideSignal, modalComponentIm } = this.props;

    const isDisabled = modalComponentIm.get('isDisabled');

    return (
      <Fragment>
        <ModalHeader text={i18next.t('creating_customer')} />

        <div className="modal__content">
          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_add-customer__name"
            >
              {i18next.t('name')}
            </label>
            <Input
              id="modal_add-customer__name"
              type="text"
              ref={(ref) => { this.nameRef = ref; }}
              errorClassName="input-component__error_modal"
              name="input-add-customer-name"
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_add-customer_login"
            >
              {i18next.t('login')}
            </label>
            <Input
              id="modal_add-customer_login"
              type="text"
              ref={(ref) => { this.loginRef = ref; }}
              errorClassName="input-component__error_modal"
              name="input-add-customer-login"
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_add-customer__password"
            >
              {i18next.t('password')}
            </label>
            <Input
              id="modal_add-customer__password"
              type="password"
              ref={(ref) => { this.passwordRef = ref; }}
              errorClassName="input-component__error_modal"
              name="input-add-customer-password"
              autoComplete="new-password"
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_add-customer__email"
            >
              {i18next.t('email')}
            </label>
            <Input
              id="modal_add-customer__email"
              type="text"
              ref={(ref) => { this.emailRef = ref; }}
              errorClassName="input-component__error_modal"
              name="input-add-customer-email"
            />
          </div>

          <div className="modal__item modal__item-name_padding-bottom">
            <label className="modal__item-name" htmlFor="modal_add-customer__notes">
              {i18next.t('notes')}
            </label>
            <textarea
              id="modal_add-customer__notes"
              className="input input_textarea"
              ref={(ref) => { this.descriptionRef = ref; }}
            />
          </div>
        </div>

        <ModalOkCancelButtons
          isDisabled={isDisabled}
          closeAction={modalComponentHideSignal}
          onSubmit={this.onSubmit}
          okText={i18next.t('create')}
          cancelText={i18next.t('cancel')}
        />
      </Fragment>
    );
  }
}
