import React, { Component, Fragment } from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ModalOkCancelButtons } from 'components/modal';
import { TState as TModalState, actions as modalActions } from 'ducks/components/modal';
import { TDataItem as TCustomer, actions as customersActions } from 'ducks/data/customers';

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
class ModalBlockCustomer extends Component<IProps, IState> {
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

  private onSubmit(): void {
    const {
      customersDataUpdateSignal,
      modalComponentSubmitWrapperSignal,
      dispatch,
    } = this.props;
    const { customerIm } = this.state;

    modalComponentSubmitWrapperSignal({
      doneText: i18next.t('customer_edited', { name: customerIm.get('name') }),
      submitSignal: () => dispatch(customersDataUpdateSignal({
        id: customerIm.get('id'),
        data: { active: this.isActive() ? 0 : 1 },
      })),
    });
  }

  private isActive(): boolean {
    return this.state.customerIm.get('active') === 1;
  }

  render() {
    const { modalComponentHideSignal, modalComponentIm } = this.props;
    const { customerIm } = this.state;

    const name = customerIm.get('name');
    const isActive = this.isActive();
    const { isDisabled } = modalComponentIm;

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

export default connect(mapStateToProps, mapDispatchToProps)(ModalBlockCustomer);
