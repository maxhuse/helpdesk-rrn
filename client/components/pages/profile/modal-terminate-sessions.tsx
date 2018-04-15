import React, { Fragment, StatelessComponent } from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import { ModalOkCancelButtons, ModalHeader } from 'components/modal';
import { TState, actions as modalActions } from 'ducks/components/modal';
import { TFetchResult } from 'ducks/fetch';

const mapStateToProps = state => ({
  modalComponentIm: state.components.modalComponentIm,
});

const mapDispatchToProps = {
  modalComponentHideSignal: modalActions.modalComponentHideSignal,
  modalComponentSubmitWrapperSignal: modalActions.modalComponentSubmitWrapperSignal,
};

interface IProps {
  modalComponentIm: TState,
  modalComponentHideSignal: typeof modalActions.modalComponentHideSignal,
  modalComponentSubmitWrapperSignal: typeof modalActions.modalComponentSubmitWrapperSignal,
  submitSignal: () => Promise<TFetchResult>,
}
const ModalTerminateSessions: StatelessComponent<IProps> = ({
  modalComponentIm,
  modalComponentHideSignal,
  submitSignal,
  modalComponentSubmitWrapperSignal,
}) => (
  <Fragment>
    <ModalHeader text={i18next.t('terminate_sessions_modal_header')} />

    <div className="modal__content modal__content_alert">
      {i18next.t('terminate_sessions_modal_description')}
    </div>

    <ModalOkCancelButtons
      onSubmit={() => modalComponentSubmitWrapperSignal({ submitSignal, doneText: false })}
      isDisabled={modalComponentIm.isDisabled}
      closeAction={modalComponentHideSignal}
      okText={i18next.t('terminate_sessions_confirm_button')}
      cancelText={i18next.t('cancel')}
    />
  </Fragment>
);

export default connect(mapStateToProps, mapDispatchToProps)(ModalTerminateSessions);
