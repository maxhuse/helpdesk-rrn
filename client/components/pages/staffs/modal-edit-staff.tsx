import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { VALID_EMAIL_REX, roles } from 'shared/constants';
import Input from 'components/input';
import { ModalHeader, ModalOkCancelButtons } from 'components/modal';
import { actions as modalActions, TState as TModalState } from 'ducks/components/modal';
import { actions as staffsActions, TDataItem as TStaff } from 'ducks/data/staffs';

const mapDispatchToProps = dispatch => Object.assign(
  {
    dispatch,
    staffsDataUpdateSignal: staffsActions.staffsDataUpdateSignal,
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
  staffsDataUpdateSignal: typeof staffsActions.staffsDataUpdateSignal;
  getStaff: () => TStaff | undefined;
  dispatch: Dispatch<any>;
}
interface IState {
  staffIm: TStaff;
}
class ModalEditStaff extends PureComponent<IProps, IState> {
  private nameRef: Input | null;
  private loginRef: Input | null;
  private emailRef: Input | null;
  private roleRef: HTMLSelectElement | null;
  private descriptionRef: HTMLTextAreaElement | null;

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    // staffIm wouldn't change, so we keep it in state
    this.state = {
      staffIm: props.getStaff(),
    };
  }

  private onSubmit(): void {
    const {
      staffsDataUpdateSignal,
      modalComponentSubmitWrapperSignal,
      dispatch,
    } = this.props;
    const { staffIm } = this.state;

    const options = {
      name: this.nameRef ? this.nameRef.value : '',
      login: this.loginRef ? this.loginRef.value : '',
      description: this.descriptionRef ? this.descriptionRef.value : '',
      role: this.roleRef ? this.roleRef.value : '',
      email: this.emailRef ? this.emailRef.value : '',
    };

    if (this.validate(options)) {
      modalComponentSubmitWrapperSignal({
        submitSignal: () => dispatch(staffsDataUpdateSignal({
          id: staffIm.get('id'),
          data: options,
        })),
        doneText: i18next.t('staff_edited', { name: staffIm.get('name') }),
      });
    }
  }

  /* eslint-disable indent */
  private validate({ login, name, email }: {
    login: string, name: string, email: string
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
    const { staffIm } = this.state;

    const name = staffIm.get('name');
    const login = staffIm.get('login');
    const description = staffIm.get('description');
    const role = staffIm.get('role');
    const email = staffIm.get('email');

    const { isDisabled } = modalComponentIm;

    return (
      <Fragment>
        <ModalHeader text={i18next.t('staff_edit')} />

        <div className="modal__item">
          <label
            className="modal__item-name modal__item-name_padding-bottom"
            htmlFor="modal_edit-staff__name"
          >
            {i18next.t('name')}
          </label>
          <Input
            type="text"
            defaultValue={name}
            ref={(ref) => { this.nameRef = ref; }}
            id="modal_edit-staff__name"
            errorClassName="input-component__error_modal"
            name="input-edit-staff-name"
          />
        </div>

        <div className="modal__content">
          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_edit-staff__login"
            >
              {i18next.t('login')}
            </label>
            <Input
              type="text"
              defaultValue={login}
              ref={(ref) => { this.loginRef = ref; }}
              id="modal_edit-staff__login"
              errorClassName="input-component__error_modal"
              name="input-edit-staff-login"
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_edit-staff__email"
            >
              {i18next.t('email')}
            </label>
            <Input
              type="text"
              defaultValue={email}
              ref={(ref) => { this.emailRef = ref; }}
              id="modal_edit-staff__email"
              name="input-edit-staff-email"
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_edit-staff__role"
            >
              {i18next.t('role')}
            </label>
            <select
              className="select"
              ref={(ref) => { this.roleRef = ref; }}
              id="modal_edit-staff__role"
              defaultValue={role}
            >
              <option value={roles.ENGINEER}>{i18next.t(roles.ENGINEER)}</option>
              <option value={roles.ADMIN}>{i18next.t(roles.ADMIN)}</option>
            </select>
          </div>

          <div className="modal__item">
            <label className="modal__item-name" htmlFor="modal_edit-staff__description">
              {i18next.t('notes')}
            </label>
            <textarea
              id="modal_edit-staff__description"
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditStaff);
