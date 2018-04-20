import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { VALID_EMAIL_REX } from 'shared/constants';
import Input from 'components/input';
import { ModalHeader, ModalOkCancelButtons } from 'components/modal';
import { actions as modalActions, TState as TModalState } from 'ducks/components/modal';
import { actions as customersActions, TDataItem as TCustomer } from 'ducks/data/customers';

const mapDispatchToProps = dispatch => Object.assign(
  {
    dispatch,
    customersDataUpdateSignal: customersActions.customersDataUpdateSignal,
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
  customersDataUpdateSignal: typeof customersActions.customersDataUpdateSignal;
  getCustomer: () => TCustomer | undefined;
  dispatch: Dispatch<any>;
}
interface IState {
  customerIm: TCustomer;
}
class ModalEditCustomer extends PureComponent<IProps, IState> {
  private nameRef: Input | null;
  private loginRef: Input | null;
  private emailRef: Input | null;
  private descriptionRef: HTMLTextAreaElement | null;

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    // customerIm wouldn't change, so we keep it in state
    this.state = {
      customerIm: props.getCustomer(),
    };
  }

  private onSubmit(): void {
    const {
      dispatch,
      customersDataUpdateSignal,
      modalComponentSubmitWrapperSignal,
    } = this.props;
    const { customerIm } = this.state;

    const options = {
      name: this.nameRef ? this.nameRef.value : '',
      login: this.loginRef ? this.loginRef.value : '',
      email: this.emailRef ? this.emailRef.value : '',
      description: this.descriptionRef ? this.descriptionRef.value : '',
    };

    if (this.validate(options)) {
      modalComponentSubmitWrapperSignal({
        submitSignal: () => dispatch(customersDataUpdateSignal({
          id: customerIm.get('id'),
          data: options,
        })),
        doneText: i18next.t('customer_edited', { name: customerIm.get('name') }),
      });
    }
  }

  private validate(
    { name, login, email }: { name: string, login: string, email: string }
  ): string | boolean {
    let isValid = true;

    // Login
    if (login !== undefined) {
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
    }

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
    const { customerIm } = this.state;

    const name = customerIm.get('name');
    const login = customerIm.get('login');
    const description = customerIm.get('description');
    const email = customerIm.get('email');

    const { isDisabled } = modalComponentIm;

    return (
      <Fragment>
        <ModalHeader text={i18next.t('customer_edit')} />

        <div className="modal__item">
          <label
            className="modal__item-name modal__item-name_padding-bottom"
            htmlFor="modal_edit-customer__name"
          >
            {i18next.t('name')}
          </label>
          <Input
            type="text"
            defaultValue={name}
            ref={(ref) => { this.nameRef = ref; }}
            id="modal_edit-customer__name"
            errorClassName="input-component__error_modal"
            name="input-edit-customer-name"
          />
        </div>

        <div className="modal__content">
          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_edit-customer__login"
            >
              {i18next.t('login')}
            </label>
            <Input
              type="text"
              defaultValue={login}
              ref={(ref) => { this.loginRef = ref; }}
              id="modal_edit-customer__login"
              errorClassName="input-component__error_modal"
              name="input-edit-customer-login"
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_edit-customer__email"
            >
              {i18next.t('email')}
            </label>
            <Input
              type="text"
              defaultValue={email}
              ref={(ref) => { this.emailRef = ref; }}
              id="modal_edit-customer__email"
              name="input-edit-customer-email"
            />
          </div>

          <div className="modal__item">
            <label className="modal__item-name" htmlFor="modal_edit-customer__description">
              {i18next.t('notes')}
            </label>
            <textarea
              id="modal_edit-customer__description"
              className="input input_textarea"
              defaultValue={description}
              ref={(ref) => { this.descriptionRef = ref; }}
            />
          </div>
        </div>

        <ModalOkCancelButtons
          isDisabled={isDisabled}
          closeAction={modalComponentHideSignal}
          onSubmit={this.onSubmit}
          okText={i18next.t('edit')}
          cancelText={i18next.t('cancel')}
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditCustomer);
