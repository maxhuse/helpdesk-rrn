import React, { Fragment } from 'react';
import i18next from 'i18next';
import ModalButtons from 'components/modal/modal-ok-cancel-buttons';
import ModalHeader from 'components/modal/modal-header';

const ModalTerminateSessions = ({
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

    <ModalButtons
      onSubmit={() => modalComponentSubmitWrapperSignal({ submitSignal })}
      isDisabled={modalComponentIm.get('isDisabled')}
      closeAction={modalComponentHideSignal}
      okText={i18next.t('terminate_sessions_confirm_button')}
      cancelText={i18next.t('cancel')}
    />
  </Fragment>
);

export default ModalTerminateSessions;
