import React, { Fragment, StatelessComponent } from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { Map } from 'immutable';
import { Table } from 'components/table';
import { roles } from 'shared/constants';
import { getFormatDate } from 'helpers';
import { sortType, sortOrder, filterType } from 'client-constants';
import Modal, { modalContainerEnhance } from 'components/modal';
import dataFetcherEnhance from 'components/data-fetcher-enhance';
import { actions as ticketsActions, TState as TTicketsState } from 'ducks/data/tickets';
import { actions as customersActions, TState as TCustomersState } from 'ducks/data/customers';
import { actions as modalActions } from 'ducks/components/modal';
import { TState as TAuthState } from 'ducks/data/auth';
import { TCells, TFilterFields } from 'components/table/types';
import TicketStatusCell from './status-cell';
import ModalAddTicket from './modal-add-ticket';
import ModalShowTicket from './modal-show-ticket';

const mapDispatchToProps = {
  ticketsDataGetSignal: ticketsActions.ticketsDataGetSignal,
  customersDataGetSignal: customersActions.customersDataGetSignal,
  modalComponentShowSignal: modalActions.modalComponentShowSignal,
};

function mapStateToProps(state) {
  const userRole = state.data.authDataIm.getIn(['data', 'role']);
  const fetchActionAttributes = userRole === roles.CUSTOMER ?
    [{ name: 'ticketsDataGetSignal' }] :
    [
      { name: 'customersDataGetSignal' },
      { name: 'ticketsDataGetSignal' }
    ];

  return {
    authDataIm: state.data.authDataIm,
    ticketsDataIm: state.data.ticketsDataIm,
    customersDataIm: state.data.customersDataIm,
    fetchActionAttributes,
  };
}

const modalId = {
  ADD: 'addTicket',
  SHOW_TICKET: 'showTicket',
};

// Call modalContainerEnhance for passing modalComponentIm into the component
const TicketsModal = () => (
  <Fragment>
    <Modal modalId={modalId.ADD}>
      <ModalAddTicket />
    </Modal>

    <Modal
      modalId={modalId.SHOW_TICKET}
      modalWrapperClassName="modal__wrapper modal__wrapper_dialog"
    >
      <ModalShowTicket />
    </Modal>
  </Fragment>
);
const TicketsModalContainer = modalContainerEnhance(TicketsModal);

interface IProps {
  authDataIm: TAuthState;
  ticketsDataIm: TTicketsState;
  customersDataIm: TCustomersState;
  ticketsDataGetSignal: typeof ticketsActions.ticketsDataGetSignal;
  customersDataGetSignal: typeof customersActions.customersDataGetSignal;
  modalComponentShowSignal: typeof modalActions.modalComponentShowSignal;
}
const Tickets: StatelessComponent<IProps> = ({
  authDataIm,
  ticketsDataIm,
  customersDataIm,
  modalComponentShowSignal,
}) => {
  const userRole = authDataIm.getIn(['data', 'role']);
  const isStaff = userRole === roles.ADMIN || userRole === roles.ENGINEER;

  // Describe table cells
  const cells: TCells = [
    {
      id: 'id',
      getValue: model => model.get('id'),
      className: 'table_tickets__cell_id',
      name: i18next.t('id'),
      sort: {
        type: sortType.ARITHMETIC,
        field: 'id',
      },
    },
    {
      id: 'subject',
      getValue: model => model.get('subject'),
      className: 'table_tickets__cell_subject',
      name: i18next.t('subject'),
    },
  ];

  if (isStaff) {
    cells.push({
      id: 'customerName',
      getValue: model => model.get('customerName'),
      className: 'table_tickets__cell_customer',
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
    className: 'table_tickets__cell_date',
    name: i18next.t('creation_date'),
    sort: {
      type: sortType.ARITHMETIC,
      field: 'creationDate',
    },
  });

  if (isStaff) {
    cells.push({
      id: 'staffName',
      getValue: model => model.get('staffName'),
      className: 'table_tickets__cell_engineer',
      name: i18next.t('engineer'),
      sort: {
        type: sortType.ARITHMETIC,
        field: 'staffName',
      },
    });
  }

  cells.push({
    id: 'status',
    getValue: model => model.get('status'),
    name: i18next.t('status'),
    className: 'table_tickets__cell_status',
    sort: {
      type: sortType.ALPHABETIC,
      field: 'status',
    },
    component: TicketStatusCell,
  });

  // describe table row
  const row = {
    onRowClick: id => modalComponentShowSignal(modalId.SHOW_TICKET, { id }),
  };

  // Describe filters
  const filterFields: TFilterFields = [
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
      items: () => customersDataIm.data,
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
          items={ticketsDataIm.data}
          cells={cells}
          row={row}
          filterFields={filterFields}
          showHeader
          defaultSort={defaultSort}
          createButton={userRole === roles.CUSTOMER ?
            {
              text: 'create',
              onClick: () => modalComponentShowSignal(modalId.ADD, false),
            } :
            undefined
          }
        />

        <TicketsModalContainer />
      </div>
    </div>
  );
};

const TicketsWithFetch = dataFetcherEnhance(Tickets);

export default connect(mapStateToProps, mapDispatchToProps)(TicketsWithFetch);
