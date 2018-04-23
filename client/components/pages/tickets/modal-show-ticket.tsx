import React, { PureComponent, Fragment, StatelessComponent } from 'react';
import i18next from 'i18next';
import dataFetcherEnhance from 'components/data-fetcher-enhance';
import Preloader from 'components/preloader';
import { getFormatDateTime } from 'helpers';
import { roles, ticketStatus } from 'shared/constants';
import Tooltip from 'components/tooltip';
import { actions as modalActions, TState as TModalState } from 'ducks/components/modal';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
  actions as ticketsActions,
  TState as TTicketsState,
  TDataItem as TTicket,
} from 'ducks/data/tickets';
import { actions as messagesActions, TState as TMessagesState } from 'ducks/data/messages';
import { TState as TAuthState } from 'ducks/data/auth';

interface IMessageProps {
  userName: string;
  text: string;
  date: number;
}
const Message: StatelessComponent<IMessageProps> = ({ userName, text, date }) => (
  <div className="message-dialog__message">
    <div className="message-dialog__message-user">{userName}</div>
    <div className="message-dialog__message-text">{text}</div>
    <div className="message-dialog__message-date">{getFormatDateTime(date)}</div>
  </div>
);

interface IShowTicketMessagesProps {
  messagesDataIm: TMessagesState;
  authDataIm: TAuthState;
  ticketIm: TTicket;
  messagesDataAddSignal: typeof messagesActions.messagesDataAddSignal;
  dispatch: Dispatch<any>;
}
class ShowTicketMessages extends PureComponent<IShowTicketMessagesProps> {
  private textRef: HTMLTextAreaElement | null;

  constructor(props) {
    super(props);

    this.onSend = this.onSend.bind(this);
  }

  private onSend(): void {
    const text = this.textRef ? this.textRef.value : '';
    const { ticketIm, messagesDataAddSignal, dispatch } = this.props;
    const ticketId = ticketIm.get('id');

    if (text.length > 0) {
      dispatch(messagesDataAddSignal({ data: { ticketId, text } })).then(({ status }) => {
        if (status === 200) {
          this.clearTextarea();
        }
      });
    }
  }

  private clearTextarea(): void {
    if (this.textRef) {
      this.textRef.value = '';
    }
  }

  private isInputAvailable(): boolean {
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
          {messagesDataIm.data.map(message => (
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

const ModalPreloader: StatelessComponent = () => (
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

interface IModalShowTicketProps {
  messagesDataIm: TMessagesState;
  authDataIm: TAuthState;
  ticketsDataIm: TTicketsState;
  modalComponentIm: TModalState;
  modalComponentHideSignal: typeof modalActions.modalComponentHideSignal;
  messagesDataAddSignal: typeof messagesActions.messagesDataAddSignal;
  messagesDataGetSignal: typeof messagesActions.messagesDataGetSignal;
  ticketsDataUpdateSignal: typeof ticketsActions.ticketsDataUpdateSignal;
  dispatch: Dispatch<any>;
}
interface IModalShowTicketState {
  ticketIm: TTicket | undefined;
}
// eslint-disable-next-line react/no-multi-comp
class ModalShowTicket extends PureComponent<IModalShowTicketProps, IModalShowTicketState> {
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

  private onAssignToMeClick(): void {
    const { ticketsDataUpdateSignal } = this.props;
    const { ticketIm } = this.state;

    if (ticketIm) {
      // Change staffId and status
      ticketsDataUpdateSignal({
        id: ticketIm.get('id'),
        data: { status: ticketStatus.ASSIGNED },
      });
    }
  }

  private getTicket(ticketsDataIm: TTicketsState, modalComponentIm: TModalState) {
    if (!modalComponentIm.options) {
      return undefined;
    }

    const ticketId = modalComponentIm.options.id;

    return ticketsDataIm.data.find(model => model.get('id') === ticketId);
  }

  render() {
    const {
      modalComponentHideSignal,
      messagesDataIm,
      messagesDataGetSignal,
      messagesDataAddSignal,
      authDataIm,
      ticketsDataUpdateSignal,
      dispatch,
    } = this.props;
    const { ticketIm } = this.state;

    if (!ticketIm) {
      return <ShowMessagesServerError />;
    }

    const customerName = ticketIm.get('customerName');
    const ticketId = ticketIm.get('id');
    const status = ticketIm.get('status');
    const staffName = ticketIm.get('staffName');
    const subject = ticketIm.get('subject');
    const staffId = ticketIm.get('staffId');
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
              <div className="message-dialog__header-subject">{subject}</div>
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
                  {(status === ticketStatus.ASSIGNED && userId === staffId) &&
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
              dispatch={dispatch}
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

const mapDispatchToProps = dispatch => Object.assign(
  {
    dispatch,
    messagesDataAddSignal: messagesActions.messagesDataAddSignal,
  },
  bindActionCreators({
    ticketsDataUpdateSignal: ticketsActions.ticketsDataUpdateSignal,
    modalComponentHideSignal: modalActions.modalComponentHideSignal,
    messagesDataGetSignal: messagesActions.messagesDataGetSignal,
  }, dispatch),
);

const mapStateToProps = state => ({
  modalComponentIm: state.components.modalComponentIm,
  messagesDataIm: state.data.messagesDataIm,
  authDataIm: state.data.authDataIm,
  ticketsDataIm: state.data.ticketsDataIm,
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalShowTicket);
