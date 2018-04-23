import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import Input from 'components/input';
import { ModalHeader, ModalOkCancelButtons } from 'components/modal';
import { connect } from 'react-redux';
import { actions as modalActions, TState as TModalState } from 'ducks/components/modal';
import { bindActionCreators, Dispatch } from 'redux';
import { actions as ticketsActions } from 'ducks/data/tickets';

const mapDispatchToProps = dispatch => Object.assign(
  {
    dispatch,
    ticketsDataAddSignal: ticketsActions.ticketsDataAddSignal,
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
  ticketsDataAddSignal: typeof ticketsActions.ticketsDataAddSignal;
  dispatch: Dispatch<any>;
}
class ModalAddTicket extends PureComponent<IProps> {
  private subjectRef: Input | null;
  private messageRef: Input | null;

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  private onSubmit(): void {
    const { ticketsDataAddSignal, modalComponentSubmitWrapperSignal, dispatch } = this.props;

    const options = {
      subject: this.subjectRef ? this.subjectRef.value : '',
      message: this.messageRef ? this.messageRef.value : '',
    };

    if (this.validate(options)) {
      modalComponentSubmitWrapperSignal({
        submitSignal: () => dispatch(ticketsDataAddSignal({ data: options })),
        doneText: i18next.t('ticket_created'),
      });
    }
  }

  private validate({ subject, message }: { subject: string, message: string }): boolean {
    let isValid = true;

    // Subject
    if (!subject.length) {
      if (this.subjectRef) {
        this.subjectRef.error = i18next.t('v.required');
      }
      isValid = false;
    }

    // Message
    if (!message.length) {
      if (this.messageRef) {
        this.messageRef.error = i18next.t('v.required');
      }
      isValid = false;
    }

    return isValid;
  }

  render() {
    const { modalComponentHideSignal, modalComponentIm } = this.props;
    const { isDisabled } = modalComponentIm;

    return (
      <Fragment>
        <ModalHeader text={i18next.t('creating_ticket')} />

        <div className="modal__content">
          <div className="modal__item">
            <label
              className="modal__item-name modal__item-name_padding-bottom"
              htmlFor="modal_add-ticket__subject"
            >
              {i18next.t('subject')}
            </label>
            <Input
              id="modal_add-ticket__subject"
              type="text"
              ref={(ref) => { this.subjectRef = ref; }}
              errorClassName="input-component__error_modal"
              name="input-add-ticket-subject"
            />
          </div>

          <div className="modal__item modal__item-name_padding-bottom">
            <label className="modal__item-name" htmlFor="modal_add-ticket__message">
              {i18next.t('describe_problem')}
            </label>
            <Input
              id="modal_add-ticket__message"
              tagName="textarea"
              className="input-component__field_order-message"
              errorClassName="input-component__error_modal"
              ref={(ref) => { this.messageRef = ref; }}
              name="input-add-ticket-message"
            />
          </div>
        </div>

        <ModalOkCancelButtons
          isDisabled={isDisabled}
          closeAction={modalComponentHideSignal}
          onSubmit={this.onSubmit}
          okText={i18next.t('create')}
          cancelText={i18next.t('cancel')}
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddTicket);
