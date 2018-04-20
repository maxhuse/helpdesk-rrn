import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import getHashedPassword from 'tools/get-hashed-password';
import Input from 'components/input';
import { ModalHeader, ModalOkCancelButtons } from 'components/modal';
import { TState, actions as modalActions } from 'ducks/components/modal';
import { TFetchResult } from 'ducks/fetch';

const mapDispatchToProps = {
  modalComponentHideSignal: modalActions.modalComponentHideSignal,
  modalComponentSubmitWrapperSignal: modalActions.modalComponentSubmitWrapperSignal,
};

const mapStateToProps = state => ({
  modalComponentIm: state.components.modalComponentIm,
});

interface IProps {
  doneText?: () => string;
  modalComponentIm: TState;
  modalComponentHideSignal: typeof modalActions.modalComponentHideSignal;
  modalComponentSubmitWrapperSignal: typeof modalActions.modalComponentSubmitWrapperSignal;
  submitSignal: (options: { id: string | number, data: object }) => Promise<TFetchResult>;
}
class ModalChangePassword extends PureComponent<IProps> {
  private repeatRef: Input | null;
  private passwordRef: Input | null;

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  private onSubmit(): void {
    const {
      modalComponentIm,
      submitSignal,
      doneText,
      modalComponentSubmitWrapperSignal,
    } = this.props;

    if (!this.passwordRef || !this.repeatRef) {
      return;
    }

    const options = {
      password: this.passwordRef.value,
      repeat: this.repeatRef.value,
    };

    const userId = modalComponentIm.options ? modalComponentIm.options.id : false;

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

  private validate({ password, repeat }: { password: string, repeat: string }): boolean {
    let isValid = true;

    if (!password.length && this.passwordRef) {
      this.passwordRef.error = i18next.t('v.required');

      isValid = false;
    } else if (password.length < 6 && this.passwordRef) {
      this.passwordRef.error = i18next.t('v.must_be_longer_than', { count: 5 });

      isValid = false;
    }

    if (!repeat.length && this.repeatRef) {
      this.repeatRef.error = i18next.t('v.required');

      isValid = false;
    } else if (password !== repeat && this.repeatRef) {
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

    const { isDisabled } = modalComponentIm;

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

export default connect(mapStateToProps, mapDispatchToProps)(ModalChangePassword);
