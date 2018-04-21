import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { VALID_EMAIL_REX, roles } from 'shared/constants';
import Input from 'components/input';
import { ModalHeader, ModalOkCancelButtons } from 'components/modal';
import { connect } from 'react-redux';
import { actions as modalActions, TState as TModalState } from 'ducks/components/modal';
import { bindActionCreators, Dispatch } from 'redux';
import { actions as staffsActions } from 'ducks/data/staffs';

const mapDispatchToProps = dispatch => Object.assign(
  {
    dispatch,
    staffsDataAddSignal: staffsActions.staffsDataAddSignal,
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
  staffsDataAddSignal: typeof staffsActions.staffsDataAddSignal;
  dispatch: Dispatch<any>;
}
class ModalAddStaff extends PureComponent<IProps> {
  private nameRef: Input | null;
  private loginRef: Input | null;
  private passwordRef: Input | null;
  private emailRef: Input | null;
  private roleRef: HTMLSelectElement | null;
  private descriptionRef: HTMLTextAreaElement | null;

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  private onSubmit(): void {
    const { dispatch, modalComponentSubmitWrapperSignal, staffsDataAddSignal } = this.props;
    const options = {
      name: this.nameRef ? this.nameRef.value : '',
      login: this.loginRef ? this.loginRef.value : '',
      password: this.passwordRef ? this.passwordRef.value : '',
      description: this.descriptionRef ? this.descriptionRef.value : '',
      role: this.roleRef ? this.roleRef.value : '',
      email: this.emailRef ? this.emailRef.value : '',
      active: 1, // new staff is always active
    };

    if (this.validate(options)) {
      modalComponentSubmitWrapperSignal({
        submitSignal: () => dispatch(staffsDataAddSignal({ data: options })),
        doneText: i18next.t('staff_added', { name: options.name }),
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
        <ModalHeader text={i18next.t('creating_staff')} />

        <div className="modal__content">
          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_add-staff__name"
            >
              {i18next.t('name')}
            </label>
            <Input
              id="modal_add-staff__name"
              type="text"
              ref={(ref) => { this.nameRef = ref; }}
              errorClassName="input-component__error_modal"
              name="input-add-staff-name"
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_add-staff_login"
            >
              {i18next.t('login')}
            </label>
            <Input
              id="modal_add-staff_login"
              type="text"
              ref={(ref) => { this.loginRef = ref; }}
              errorClassName="input-component__error_modal"
              name="input-add-staff-login"
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_add-staff__password"
            >
              {i18next.t('password')}
            </label>
            <Input
              id="modal_add-staff__password"
              type="password"
              ref={(ref) => { this.passwordRef = ref; }}
              errorClassName="input-component__error_modal"
              name="input-add-staff-password"
              autoComplete="new-password"
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_add-staff__email"
            >
              {i18next.t('email')}
            </label>
            <Input
              id="modal_add-staff__email"
              type="text"
              ref={(ref) => { this.emailRef = ref; }}
              errorClassName="input-component__error_modal"
              name="input-add-staff-email"
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_add-staff__role"
            >
              {i18next.t('role')}
            </label>
            <select
              id="modal_add-staff__role"
              className="select"
              ref={(ref) => { this.roleRef = ref; }}
            >
              <option value={roles.ENGINEER}>{i18next.t(roles.ENGINEER)}</option>
              <option value={roles.ADMIN}>{i18next.t(roles.ADMIN)}</option>
            </select>
          </div>

          <div className="modal__item modal__item-name_padding-bottom">
            <label className="modal__item-name" htmlFor="modal_add-staff__notes">
              {i18next.t('notes')}
            </label>
            <textarea
              id="modal_add-staff__notes"
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddStaff);
