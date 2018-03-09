import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import dataFetcherEnhance from 'components/data-fetcher-enhance/data-fetcher-enhance';
import Preloader from 'components/preloader';
import { getFormatDateTime } from 'helpers';
import { roles, ticketStatus } from 'shared/constants';

const Message = ({ userName, text, date }) => (
  <div className="message-dialog__message">
    <div className="message-dialog__message-user">{userName}</div>
    <div className="message-dialog__message-text">{text}</div>
    <div className="message-dialog__message-date">{getFormatDateTime(date)}</div>
  </div>
);

class ShowTicketMessages extends PureComponent {
  constructor(props) {
    super(props);

    this.onSend = this.onSend.bind(this);
  }

  onSend() {
    const text = this.textRef.value;
    const { ticketIm } = this.props;
    const ticketId = ticketIm.get('id');

    if (text.length > 0) {
      this.props.messagesDataAddSignal({ data: { ticketId, text } }).then(({ status }) => {
        switch (status) {
          case 200:
            this.clearTextarea();
            break;

          default:
            break;
        }
      });
    }
  }

  clearTextarea() {
    this.textRef.value = '';
  }

  isInputAvailable() {
    const { ticketIm, authDataIm } = this.props;
    const isClosed = ticketIm.get('status') === ticketStatus.CLOSED;
    const userRole = authDataIm.getIn(['data', 'role']);
    const userId = authDataIm.getIn(['data', 'id']);
    const isAssignedToEngineer = userRole === roles.ENGINEER && ticketIm.get('staffId') === userId;

    return !isClosed && (isAssignedToEngineer || userRole === roles.ADMIN);
  }

  render() {
    const { messagesDataIm } = this.props;

    return (
      <Fragment>
        <div className="message-dialog__messages-area">
          {messagesDataIm.get('data').map(message => (
            <Message
              key={message.get('id')}
              userName={message.get('userName')}
              date={message.get('date')}
              text={message.get('text')}
            />
          ))}
        </div>

        {this.isInputAvailable() ?
          <div className="message-dialog__input-area">
            <textarea
              id="modal_show-ticket_text"
              className="input input_textarea message-dialog__textarea"
              ref={(ref) => { this.textRef = ref; }}
            />
            <div className="message-dialog__send-button">
              <button
                className="button button_raised button_raised_green"
                onClick={this.onSend}
              >
                <span className="message-dialog__send-button-text">{i18next.t('send')}</span>
                <i className="material-icons material-icons__size_20">send</i>
              </button>
            </div>
          </div> :
          null
        }
      </Fragment>
    );
  }
}

const ModalPreloader = () => (
  <Preloader className="preloader_modal" />
);

const ShowMessagesServerError = () => (
  <div className="message-dialog__error">
    <span>{i18next.t('error_by_getting_messages')}</span>
  </div>
);

const FetchedTicketMessages = dataFetcherEnhance(
  ShowTicketMessages,
  {
    CustomServerError: ShowMessagesServerError,
    CustomPreloader: ModalPreloader,
  }
);

// eslint-disable-next-line react/no-multi-comp
export default class ModalShowTicket extends PureComponent {
  constructor(props) {
    super(props);

    // ticketIm wouldn't change, so we keep it in state
    this.state = {
      ticketIm: props.getTicket(),
    };
  }

  render() {
    const {
      modalComponentHideSignal,
      messagesDataIm,
      messagesDataGetSignal,
      messagesDataAddSignal,
      authDataIm,
    } = this.props;
    const { ticketIm } = this.state;
    const customerName = ticketIm.get('customerName');
    const ticketId = ticketIm.get('id');

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
            <FetchedTicketMessages
              messagesDataIm={messagesDataIm}
              messagesDataGetSignal={messagesDataGetSignal}
              messagesDataAddSignal={messagesDataAddSignal}
              ticketIm={ticketIm}
              authDataIm={authDataIm}
              fetchActionAttributes={[
                {
                  name: 'messagesDataGetSignal',
                  options: { ticketId },
                }
              ]}
            />
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
        </div>
      </Fragment>
    );
  }
}
