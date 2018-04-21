import React, { Component, Fragment } from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ModalOkCancelButtons } from 'components/modal';
import { TState as TModalState, actions as modalActions } from 'ducks/components/modal';
import { TDataItem as TStaff, actions as staffsActions } from 'ducks/data/staffs';

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
class ModalBlockStaff extends Component<IProps, IState> {
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

  private onSubmit(): void {
    const {
      staffsDataUpdateSignal,
      modalComponentSubmitWrapperSignal,
      dispatch,
    } = this.props;
    const { staffIm } = this.state;

    modalComponentSubmitWrapperSignal({
      doneText: i18next.t('staff_edited', { name: staffIm.get('name') }),
      submitSignal: () => dispatch(staffsDataUpdateSignal({
        id: staffIm.get('id'),
        data: { active: this.isActive() ? 0 : 1 },
      })),
    });
  }

  private isActive(): boolean {
    return this.state.staffIm.get('active') === 1;
  }

  render() {
    const { modalComponentHideSignal, modalComponentIm } = this.props;
    const { staffIm } = this.state;

    const name = staffIm.get('name');
    const isActive = this.isActive();
    const { isDisabled } = modalComponentIm;

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

export default connect(mapStateToProps, mapDispatchToProps)(ModalBlockStaff);
