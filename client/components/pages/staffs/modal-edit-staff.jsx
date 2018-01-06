import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { VALID_EMAIL_REX } from 'shared/constants';
import Input from 'components/input';
import ModalHeader from 'components/modal/modal-header';
import ModalOkCancelButtons from 'components/modal/modal-ok-cancel-buttons';
import { roles } from 'constants';

export default class ModalEditStaff extends PureComponent {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    // staffIm wouldn't change, so we keep it in state
    this.state = {
      staffIm: props.getStaff(),
    };
  }

  onSubmit() {
    const {
      submitSignal,
      modalComponentSubmitWrapperSignal,
    } = this.props;
    const { staffIm } = this.state;

    const options = {
      login: this.loginRef.value,
      name: this.nameRef.value,
      description: this.descriptionRef.value,
      role: this.roleRef.value,
      email: this.emailRef.value,
    };

    if (this.validate(options)) {
      modalComponentSubmitWrapperSignal({
        submitSignal: () => submitSignal({ id: staffIm.get('id'), data: options }),
        doneText: i18next.t('staff_edited', { name: staffIm.get('name') }),
      });
    }
  }

  validate({ name, login, email }) {
    let isValid = true;

    // Login
    if (login !== undefined) {
      if (!login.length) {
        this.loginRef.error = i18next.t('v.required');
        isValid = false;
      } else if (login.length < 6) {
        this.loginRef.error = i18next.t('v.must_be_longer_than', { count: 5 });
        isValid = false;
      }
    }

    // Name
    if (!name.length) {
      this.nameRef.error = i18next.t('v.required');
      isValid = false;
    } else if (name.length < 3) {
      this.nameRef.error = i18next.t('v.must_be_longer_than', { count: 2 });
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
    const { staffIm } = this.state;

    const name = staffIm.get('name');
    const login = staffIm.get('login');
    const description = staffIm.get('description');
    const role = staffIm.get('role');
    const email = staffIm.get('email');

    const isDisabled = modalComponentIm.get('isDisabled');

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
