import React, { PureComponent, Fragment } from 'react';
import i18next from 'i18next';
import { sortType, filterType } from 'constants.js';
import { Table } from 'containers';
import Modal, { modalContainerEnhance } from 'containers/modal';
import ModalChangePassword from 'components/modal/change-password';
import ModalAddCustomer from './modal-add-customer';
import ModalEditCustomer from './modal-edit-customer';
import ModalBlockCustomer from './modal-block-customer';

const modalId = {
  ADD: 'addCustomer',
  EDIT: 'editCustomer',
  BLOCK: 'blockCustomer',
  CHANGE_PASSWORD: 'changePassword',
};

// Call modalContainerEnhance for passing modalComponentIm into the component
const CustomersModalContainer = modalContainerEnhance(
  class extends PureComponent {
    render() {
      const {
        customersDataIm,
        modalComponentIm,
        customersDataAddSignal,
        customersDataUpdateSignal,
      } = this.props;

      return (
        <Fragment>
          <Modal modalId={modalId.ADD}>
            <ModalAddCustomer submitSignal={customersDataAddSignal} />
          </Modal>

          <Modal modalId={modalId.EDIT}>
            <ModalEditCustomer
              getCustomer={() => {
                const customerId = modalComponentIm.get('options').id;

                return customersDataIm.get('data').find(model => model.get('id') === customerId);
              }}
              submitSignal={customersDataUpdateSignal}
            />
          </Modal>

          <Modal modalId={modalId.BLOCK}>
            <ModalBlockCustomer
              getCustomer={() => {
                const customerId = modalComponentIm.get('options').id;

                return customersDataIm.get('data').find(model => model.get('id') === customerId);
              }}
              submitSignal={customersDataUpdateSignal}
            />
          </Modal>

          <Modal modalId={modalId.CHANGE_PASSWORD}>
            <ModalChangePassword
              doneText={() => {
                const customerId = modalComponentIm.get('options').id;
                const customerIm = customersDataIm.get('data')
                  .find(model => model.get('id') === customerId);

                return i18next.t('customer_edited', { name: customerIm.get('name') });
              }}
              submitSignal={customersDataUpdateSignal}
            />
          </Modal>
        </Fragment>
      );
    }
  }
);

const Customers = ({
  customersDataIm,
  customersDataAddSignal,
  customersDataUpdateSignal,
  modalComponentShowDelta,
}) => {
  // Describe table cells
  const cells = [
    {
      id: 'name',
      getValue: model => model.get('name'),
      className: 'table__cell_2',
      name: i18next.t('name'),
      sort: {
        type: sortType.ALPHABETIC,
        field: 'name',
      },
    },
    {
      id: 'login',
      getValue: model => model.get('login'),
      className: 'table__cell_1',
      name: i18next.t('login'),
      sort: {
        type: sortType.ALPHABETIC,
        field: 'login',
      },
    },
    {
      id: 'email',
      getValue: model => model.get('email'),
      name: i18next.t('email'),
      className: 'table__cell_3',
    },
    {
      id: 'notes',
      getValue: model => model.get('description'),
      name: i18next.t('notes'),
      isHiddenOnClosed: true,
    },
  ];

  // describe table row
  const row = {
    iconButtons: [
      {
        getIcon: () => 'edit',
        getTitle: () => i18next.t('edit'),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowDelta(modalId.EDIT, { id: item.get('id') }),
      },
      {
        getIcon: () => 'account_circle',
        getTitle: () => i18next.t('change_password'),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowDelta(modalId.CHANGE_PASSWORD, { id: item.get('id') }),
      },
      {
        getIcon: item => (item.get('active') ? 'enhanced_encryption' : 'no_encryption'),
        getTitle: item => i18next.t(item.get('active') ? 'block' : 'unblock'),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowDelta(modalId.BLOCK, { id: item.get('id') }),
      },
    ],
  };

  // Describe filters
  const filterFields = [
    {
      type: filterType.TEXT,
      key: 'name',
      name: i18next.t('name'),
    },
    {
      type: filterType.TEXT,
      key: 'login',
      name: i18next.t('login'),
    },
  ];

  return (
    <div className="content">
      <div className="content__body">
        <Table
          items={customersDataIm.get('data')}
          cells={cells}
          row={row}
          filterFields={filterFields}
          showHeader
          createButton={{
            onClick: () => modalComponentShowDelta(modalId.ADD, false),
          }}
        />

        <CustomersModalContainer
          customersDataIm={customersDataIm}
          customersDataAddSignal={customersDataAddSignal}
          customersDataUpdateSignal={customersDataUpdateSignal}
        />
      </div>
    </div>
  );
};

export default Customers;
