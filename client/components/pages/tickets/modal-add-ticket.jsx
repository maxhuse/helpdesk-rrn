import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import Input from 'components/input';
import { ModalHeader, ModalOkCancelButtons } from 'components/modal';

export default class ModalAddTicket extends PureComponent {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const options = {
      subject: this.subjectRef.value,
      message: this.messageRef.value,
    };

    if (this.validate(options)) {
      this.props.modalComponentSubmitWrapperSignal({
        submitSignal: () => this.props.submitSignal({ data: options }),
        doneText: i18next.t('ticket_created'),
      });
    }
  }

  validate({ subject, message }) {
    let isValid = true;

    // Subject
    if (!subject.length) {
      this.subjectRef.error = i18next.t('v.required');
      isValid = false;
    }

    // Message
    if (!message.length) {
      this.messageRef.error = i18next.t('v.required');
      isValid = false;
    }

    return isValid;
  }

  render() {
    const { modalComponentHideSignal, modalComponentIm } = this.props;

    const isDisabled = modalComponentIm.get('isDisabled');

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
