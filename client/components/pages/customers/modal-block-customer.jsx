import React, { Component, Fragment } from 'react';
import i18next from 'i18next';
import { ModalOkCancelButtons } from 'components/modal';

export default class ModalBlockStaff extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      customerIm: props.getCustomer(),
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
    const { customerIm } = this.state;

    modalComponentSubmitWrapperSignal({
      doneText: i18next.t('customer_edited', { name: customerIm.get('name') }),
      submitSignal: () => submitSignal({
        id: customerIm.get('id'),
        data: { active: this.isActive() ? 0 : 1 },
      }),
    });
  }

  isActive() {
    return this.state.customerIm.get('active') === 1;
  }

  render() {
    const { modalComponentHideSignal, modalComponentIm } = this.props;
    const { customerIm } = this.state;

    const name = customerIm.get('name');
    const isActive = this.isActive();
    const isDisabled = modalComponentIm.get('isDisabled');

    return (
      <Fragment>
        <div className="modal__content modal__content_alert">
          {i18next.t(isActive ? 'confirm.block_customer' : 'confirm.unblock_customer', { name })}
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
