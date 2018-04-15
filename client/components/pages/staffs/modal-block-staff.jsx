import React, { Component, Fragment } from 'react';
import i18next from 'i18next';
import { ModalOkCancelButtons } from 'components/modal';

export default class ModalBlockStaff extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      staffIm: props.getStaff(),
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  onSubmit() {
    const {
      submitSignal,
      modalComponentSubmitWrapperSignal,
    } = this.props;
    const { staffIm } = this.state;

    modalComponentSubmitWrapperSignal({
      doneText: i18next.t('staff_edited', { name: staffIm.get('name') }),
      submitSignal: () => submitSignal({
        id: staffIm.get('id'),
        data: { active: this.isActive() ? 0 : 1 },
      }),
    });
  }

  isActive() {
    return this.state.staffIm.get('active') === 1;
  }

  render() {
    const { modalComponentHideSignal, modalComponentIm } = this.props;
    const { staffIm } = this.state;

    const name = staffIm.get('name');
    const isActive = this.isActive();
    const isDisabled = modalComponentIm.get('isDisabled');

    return (
      <Fragment>
        <div className="modal__content modal__content_alert">
          {i18next.t(isActive ? 'confirm.block_staff' : 'confirm.unblock_staff', { name })}
        </div>

        <ModalOkCancelButtons
          isDisabled={isDisabled}
          closeAction={modalComponentHideSignal}
          onSubmit={this.onSubmit}
          okText={i18next.t(isActive ? 'block' : 'unblock')}
          cancelText={i18next.t('cancel')}
        />
      </Fragment>
    );
  }
}
