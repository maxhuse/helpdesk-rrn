import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import dataFetcherEnhance from 'components/data-fetcher-enhance';
import Preloader from 'components/preloader';
import { getFormatDateTime } from 'helpers';
import { roles, ticketStatus } from 'shared/constants';
import Tooltip from 'components/tooltip';

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
        if (status === 200) {
          this.clearTextarea();
        }
      });
    }
  }

  clearTextarea() {
    this.textRef.value = '';
  }

  isInputAvailable() {
    const { ticketIm, authDataIm } = this.props;
    const status = ticketIm.get('status');
    const isClosed = status === ticketStatus.CLOSED;
    const userRole = authDataIm.getIn(['data', 'role']);
    const userId = authDataIm.getIn(['data', 'id']);
    const isAssignedToEngineer = userRole === roles.ENGINEER &&
      status === ticketStatus.ASSIGNED &&
      userId === ticketIm.get('staffId');

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

const ChangeStatusTooltip = props => (
  <Fragment>
    <div className="message-dialog__tooltip-item" onClick={props.onPendingClick}>
      <span>{i18next.t('pending')}</span>
    </div>
    <div className="message-dialog__tooltip-item" onClick={props.onCloseClick}>
      <span>{i18next.t('close_ticket')}</span>
    </div>
  </Fragment>
);

// eslint-disable-next-line react/no-multi-comp
export default class ModalShowTicket extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ticketIm: this.getTicket(props.ticketsDataIm, props.modalComponentIm),
    };

    this.onAssignToMeClick = this.onAssignToMeClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (('ticketsDataIm' in nextProps) || ('modalComponentIm' in nextProps)) {
      if (nextProps.modalComponentIm.get('activeId')) {
        this.setState({
          ticketIm: this.getTicket(nextProps.ticketsDataIm, nextProps.modalComponentIm),
        });
      }
    }
  }

  onAssignToMeClick() {
    const { ticketsDataUpdateSignal } = this.props;
    const { ticketIm } = this.state;

    // Change staffId and status
    ticketsDataUpdateSignal({
      id: ticketIm.get('id'),
      data: { status: ticketStatus.ASSIGNED },
    });
  }

  getTicket(ticketsDataIm, modalComponentIm) {
    const ticketId = modalComponentIm.get('options').id;

    return ticketsDataIm.get('data').find(model => model.get('id') === ticketId);
  }

  render() {
    const {
      modalComponentHideSignal,
      messagesDataIm,
      messagesDataGetSignal,
      messagesDataAddSignal,
      authDataIm,
      ticketsDataUpdateSignal,
    } = this.props;
    const { ticketIm } = this.state;
    const customerName = ticketIm.get('customerName');
    const ticketId = ticketIm.get('id');
    const status = ticketIm.get('status');
    const staffName = ticketIm.get('staffName');
    const userRole = authDataIm.getIn(['data', 'role']);
    const userId = authDataIm.getIn(['data', 'id']);
    const isStaff = userRole === roles.ADMIN || userRole === roles.ENGINEER;
    const changeStatusTooltipBlock = (
      <ChangeStatusTooltip
        onPendingClick={() =>
          ticketsDataUpdateSignal({
            id: ticketIm.get('id'),
            data: { status: ticketStatus.PENDING },
          })
        }
        onCloseClick={() =>
          ticketsDataUpdateSignal({
            id: ticketIm.get('id'),
            data: { status: ticketStatus.CLOSED },
          })
        }
      />
    );

    return (
      <Fragment>
        <div className="message-dialog">
          <div className="message-dialog__header">
            <div className="message-dialog__header-item">
              <div className="message-dialog__header-subject">{ticketIm.get('subject')}</div>
              {customerName &&
                <div className="message-dialog__header-customer">{customerName}</div>
              }
            </div>
            <div className="message-dialog__header-item">
              {isStaff &&
                <Fragment>
                  <div>
                    <span>{i18next.t('assignee')}: </span>
                    <span className="message-dialog__header-assignee">
                      {status === ticketStatus.ASSIGNED ? staffName : '\u2014'}
                    </span>
                  </div>
                  {(status === ticketStatus.NEW || status === ticketStatus.PENDING) &&
                    <span
                      className="message-dialog__header-action-link"
                      onClick={this.onAssignToMeClick}
                    >
                      {i18next.t('assign_to_me')}
                    </span>
                  }
                  {(status === ticketStatus.ASSIGNED && userId === ticketIm.get('staffId')) &&
                    <div className="message-dialog__change-status">
                      <Tooltip content={changeStatusTooltipBlock}>
                        <span className="message-dialog__change-link">
                          <span className="message-dialog__header-action-link">Change Status</span>
                          <i className="material-icons">expand_more</i>
                        </span>
                      </Tooltip>
                    </div>
                  }
                </Fragment>
              }
            </div>
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
