import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { VALID_EMAIL_REX, roles } from 'shared/constants';
import Input from 'components/input';
import { ModalHeader, ModalOkCancelButtons } from 'components/modal';
import { TState as TModalState, actions as modalActions } from 'ducks/components/modal';
import { actions as customersActions } from 'ducks/data/customers';

const mapDispatchToProps = dispatch => Object.assign(
  {
    dispatch,
    customersDataAddSignal: customersActions.customersDataAddSignal,
  },
  bindActionCreators({
    modalComponentHideSignal: modalActions.modalComponentHideSignal,
    modalComponentSubmitWrapperSignal: modalActions.modalComponentSubmitWrapperSignal,
  }, dispatch),
);

const mapStateToProps = state => ({
  modalComponentIm: state.components.modalComponentIm,
});

interface IProps {
  modalComponentIm: TModalState;
  modalComponentHideSignal: typeof modalActions.modalComponentHideSignal;
  modalComponentSubmitWrapperSignal: typeof modalActions.modalComponentSubmitWrapperSignal;
  customersDataAddSignal: typeof customersActions.customersDataAddSignal;
  dispatch: Dispatch<any>;
}
class ModalAddCustomer extends PureComponent<IProps> {
  private nameRef: Input | null;
  private loginRef: Input | null;
  private passwordRef: Input | null;
  private emailRef: Input | null;
  private descriptionRef: HTMLTextAreaElement | null;

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  private onSubmit(): void {
    const { dispatch, modalComponentSubmitWrapperSignal, customersDataAddSignal } = this.props;
    const options = {
      name: this.nameRef ? this.nameRef.value : '',
      login: this.loginRef ? this.loginRef.value : '',
      password: this.passwordRef ? this.passwordRef.value : '',
      description: this.descriptionRef ? this.descriptionRef.value : '',
      role: roles.CUSTOMER,
      email: this.emailRef ? this.emailRef.value : '',
      active: 1, // new customer is always active
    };

    if (this.validate(options)) {
      modalComponentSubmitWrapperSignal({
        submitSignal: () => dispatch(customersDataAddSignal({ data: options })),
        doneText: i18next.t('customer_added', { name: options.name }),
      });
    }
  }

  /* eslint-disable indent */
  private validate({ login, password, name, email }: {
    login: string, password: string, name: string, email: string
  }): string | boolean {
  /* eslint-enable indent */
    let isValid = true;

    // Name
    if (!name.length) {
      if (this.nameRef) {
        this.nameRef.error = i18next.t('v.required');
      }
      isValid = false;
    } else if (name.length < 3) {
      if (this.nameRef) {
        this.nameRef.error = i18next.t('v.must_be_longer_than', { count: 2 });
      }
      isValid = false;
    }

    // Login
    if (!login.length) {
      if (this.loginRef) {
        this.loginRef.error = i18next.t('v.required');
      }
      isValid = false;
    } else if (login.length < 6) {
      if (this.loginRef) {
        this.loginRef.error = i18next.t('v.must_be_longer_than', { count: 5 });
      }
      isValid = false;
    }

    // Password
    if (!password.length) {
      if (this.passwordRef) {
        this.passwordRef.error = i18next.t('v.required');
      }
      isValid = false;
    } else if (password.length < 6) {
      if (this.passwordRef) {
        this.passwordRef.error = i18next.t('v.must_be_longer_than', { count: 5 });
      }
      isValid = false;
    }

    // Email
    if (email.length > 0 && !VALID_EMAIL_REX.test(email)) {
      if (this.emailRef) {
        this.emailRef.error = i18next.t('v.invalid_email');
      }
      isValid = false;
    }

    return isValid;
  }

  render() {
    const { modalComponentHideSignal, modalComponentIm } = this.props;
    const { isDisabled } = modalComponentIm;

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

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddCustomer);
