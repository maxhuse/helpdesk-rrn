import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import getHashedPassword from 'tools/get-hashed-password';
import Input from 'components/input';
import ModalHeader from 'components/modal/modal-header';
import ModalOkCancelButtons from 'components/modal/modal-ok-cancel-buttons';

export default class ModalChangePassword extends PureComponent {
  static propTypes = {
    submitSignal: PropTypes.func,
    doneText: PropTypes.func,
    modalComponentSubmitWrapperSignal: PropTypes.func,
    modalComponentHideSignal: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const {
      modalComponentIm,
      submitSignal,
      doneText,
      modalComponentSubmitWrapperSignal,
    } = this.props;

    const options = {
      password: this.passwordRef.value,
      repeat: this.repeatRef.value,
    };

    const userId = modalComponentIm.get('options').id;

    const resultDoneText = typeof doneText === 'function' && doneText();

    if (this.validate(options)) {
      modalComponentSubmitWrapperSignal({
        doneText: resultDoneText,
        submitSignal: () => submitSignal({
          id: userId,
          data: { password: getHashedPassword(options.password) },
        }),
      });
    }
  }

  validate({ password, repeat }) {
    let isValid = true;

    if (!password.length) {
      this.passwordRef.error = i18next.t('v.required');

      isValid = false;
    } else if (password.length < 6) {
      this.passwordRef.error = i18next.t('v.must_be_longer_than', { count: 5 });

      isValid = false;
    }

    if (!repeat.length) {
      this.repeatRef.error = i18next.t('v.required');

      isValid = false;
    } else if (password !== repeat) {
      this.repeatRef.error = i18next.t('v.not_match_password');

      isValid = false;
    }

    return isValid;
  }

  render() {
    const {
      modalComponentHideSignal,
      modalComponentIm,
    } = this.props;

    const isDisabled = modalComponentIm.get('isDisabled');

    return (
      <Fragment>
        <ModalHeader text={i18next.t('changing_password')} />

        <div className="modal__content">
          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_change-password__new"
            >
              {i18next.t('enter_new_password')}
            </label>
            <Input
              id="modal_change-password__new"
              type="password"
              ref={(ref) => { this.passwordRef = ref; }}
              autoFocus
            />
          </div>

          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_change-password__repeat"
            >
              {i18next.t('repeat_password')}
            </label>
            <Input
              id="modal_change-password__repeat"
              className="input"
              type="password"
              ref={(ref) => { this.repeatRef = ref; }}
            />
          </div>
        </div>

        <ModalOkCancelButtons
          isDisabled={isDisabled}
          closeAction={modalComponentHideSignal}
          onSubmit={this.onSubmit}
          okText={i18next.t('change')}
          cancelText={i18next.t('cancel')}
        />
      </Fragment>
    );
  }
}
