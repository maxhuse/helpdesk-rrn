import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { Map } from 'immutable';
import { Table } from 'containers';
import { roles } from 'shared/constants';
import { getFormatDate } from 'helpers';
import { sortType, sortOrder, filterType } from 'constants.js';
import Modal, { modalContainerEnhance } from 'containers/modal';
import TicketStatusCell from './status-cell';
import ModalAddTicket from './modal-add-ticket';
import ModalShowTicket from './modal-show-ticket';

const modalId = {
  ADD: 'addTicket',
  SHOW_TICKET: 'showTicket',
};

// Call modalContainerEnhance for passing modalComponentIm into the component
const TicketsModalContainer = modalContainerEnhance(
  class extends PureComponent {
    render() {
      const {
        modalComponentIm,
        ticketsDataIm,
        ticketsDataAddSignal,
        messagesDataIm,
        messagesDataGetSignal,
        messagesDataAddSignal,
        authDataIm,
      } = this.props;

      return (
        <Fragment>
          <Modal modalId={modalId.ADD}>
            <ModalAddTicket submitSignal={ticketsDataAddSignal} />
          </Modal>

          <Modal
            modalId={modalId.SHOW_TICKET}
            modalWrapperClassName="modal__wrapper modal__wrapper_dialog"
          >
            <ModalShowTicket
              getTicket={() => {
                const ticketId = modalComponentIm.get('options').id;

                return ticketsDataIm.get('data').find(model => model.get('id') === ticketId);
              }}
              messagesDataIm={messagesDataIm}
              messagesDataGetSignal={messagesDataGetSignal}
              messagesDataAddSignal={messagesDataAddSignal}
              authDataIm={authDataIm}
            />
          </Modal>
        </Fragment>
      );
    }
  }
);

const Tickets = ({
  authDataIm,
  ticketsDataIm,
  customersDataIm,
  messagesDataIm,
  ticketsDataAddSignal,
  messagesDataGetSignal,
  messagesDataAddSignal,
  modalComponentShowDelta,
}) => {
  const userRole = authDataIm.getIn(['data', 'role']);
  const isStaff = userRole === roles.ADMIN || userRole === roles.ENGINEER;

  // Describe table cells
  const cells = [
    {
      id: 'id',
      getValue: model => model.get('id'),
      className: 'table__cell_2',
      name: i18next.t('id'),
      sort: {
        type: sortType.ARITHMETIC,
        field: 'id',
      },
    },
    {
      id: 'subject',
      getValue: model => model.get('subject'),
      className: 'table__cell_1',
      name: i18next.t('subject'),
    },
  ];

  if (isStaff) {
    cells.push({
      id: 'customerName',
      getValue: model => model.get('customerName'),
      className: 'table__cell_2',
      name: i18next.t('customer'),
      sort: {
        type: sortType.ALPHABETIC,
        field: 'customerName',
      },
    });
  }

  cells.push({
    id: 'creationDate',
    getValue: model => getFormatDate(model.get('creationDate')),
    className: 'table__cell_4',
    name: i18next.t('creation_date'),
    sort: {
      type: sortType.ARITHMETIC,
      field: 'creationDate',
    },
  });

  if (isStaff) {
    cells.push({
      id: 'staffId',
      // TODO: get staff name
      getValue: model => model.get('staffId'),
      className: 'table__cell_4',
      name: i18next.t('engineer'),
      sort: {
        type: sortType.ARITHMETIC,
        field: 'staffId',
      },
    });
  }

  cells.push({
    id: 'status',
    getValue: model => model.get('status'),
    name: i18next.t('status'),
    className: 'table__cell_3',
    sort: {
      type: sortType.ALPHABETIC,
      field: 'status',
    },
    component: TicketStatusCell,
  });

  // describe table row
  const row = {
    onRowClick: id => modalComponentShowDelta(modalId.SHOW_TICKET, { id }),
  };

  // Describe filters
  const filterFields = [
    {
      type: filterType.TEXT,
      key: 'subject',
      name: i18next.t('subject'),
    },
  ];

  if (isStaff) {
    filterFields.push({
      type: filterType.AUTOCOMPLETE,
      key: 'customerId',
      name: i18next.t('customer'),
      getValue: elem => elem.get('id'),
      getText: elem => elem.get('name'),
      getFilteredString: elem => elem.get('name'),
      placeholder: i18next.t('all'),
      items: () => customersDataIm.get('data'),
    });
  }

  const defaultSort = Map({
    field: 'creationDate',
    type: sortType.ARITHMETIC,
    order: sortOrder.DESC,
  });

  return (
    <div className="content">
      <div className="content__body">
        <Table
          items={ticketsDataIm.get('data')}
          cells={cells}
          row={row}
          filterFields={filterFields}
          showHeader
          defaultSort={defaultSort}
          createButton={userRole === roles.CUSTOMER ?
            {
              text: 'create',
              onClick: () => modalComponentShowDelta(modalId.ADD, false),
            } :
            null
          }
        />

        <TicketsModalContainer
          ticketsDataIm={ticketsDataIm}
          ticketsDataAddSignal={ticketsDataAddSignal}
          messagesDataIm={messagesDataIm}
          messagesDataGetSignal={messagesDataGetSignal}
          messagesDataAddSignal={messagesDataAddSignal}
          authDataIm={authDataIm}
        />
      </div>
    </div>
  );
};

export default Tickets;
