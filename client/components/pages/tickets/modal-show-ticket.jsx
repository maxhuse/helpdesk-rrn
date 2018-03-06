import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';

export default class ModalAddTicket extends PureComponent {
  constructor(props) {
    super(props);

    // ticketIm wouldn't change, so we keep it in state
    this.state = {
      ticketIm: props.getTicket(),
    };

    this.onSend = this.onSend.bind(this);
  }

  onSend() {
    const options = {
      text: this.textRef.value,
    };

    if (options.text.length > 0) {
      this.props.modalComponentSubmitWrapperSignal({
        submitSignal: () => this.props.submitSignal({ data: options }),
      });
    }
  }

  render() {
    const { modalComponentHideSignal } = this.props;
    const { ticketIm } = this.state;
    const customerName = ticketIm.get('customerName');

    return (
      <Fragment>
        <div className="message-dialog">
          <div className="message-dialog__header">
            <div className="message-dialog__header-subject">{ticketIm.get('subject')}</div>
            {customerName ?
              <div className="message-dialog__header-customer">{customerName}</div> :
              null
            }
          </div>

          <div className="message-dialog__content">
            {/* TODO: Messages here */}

            <div className="message-dialog__input-area">
              <div className="message-dialog__textarea">
                <textarea
                  id="modal_show-ticket_text"
                  className="input input_textarea"
                  ref={(ref) => { this.textRef = ref; }}
                />
              </div>
              <div className="message-dialog__send-button">
                <button
                  className="button button_raised button_raised_green"
                  onClick={this.onSend}
                >
                  <span className="message-dialog__send-button-text">{i18next.t('send')}</span>
                  <i className="material-icons material-icons__size_20">send</i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="message-dialog__footer">
          <div className="modal__footer">
            <button
              className="button button_flat button_flat_blue button_dialog"
              onClick={modalComponentHideSignal}
            >
              {i18next.t('close')}
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
