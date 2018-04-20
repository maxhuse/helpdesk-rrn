import React, { PureComponent, Fragment, StatelessComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import i18next from 'i18next';
import { sortType, filterType } from 'client-constants';
import { Table } from 'components/table';
import dataFetcherEnhance from 'components/data-fetcher-enhance';
import { actions as customersActions, TState as TCustomerState } from 'ducks/data/customers';
import { actions as modalActions, TState as TModalState } from 'ducks/components/modal';
import Modal, { ModalChangePassword, modalContainerEnhance } from 'components/modal';
import ModalAddCustomer from './modal-add-customer';
import ModalEditCustomer from './modal-edit-customer';
import ModalBlockCustomer from './modal-block-customer';

const mapDispatchToProps = {
  customersDataGetSignal: customersActions.customersDataGetSignal,
  customersDataUpdateSignal: customersActions.customersDataUpdateSignal,
  modalComponentShowSignal: modalActions.modalComponentShowSignal,
};

const mapStateToProps = state => ({
  customersDataIm: state.data.customersDataIm,
  fetchActionAttributes: [{ name: 'customersDataGetSignal' }],
});

const modalId = {
  ADD: 'addCustomer',
  EDIT: 'editCustomer',
  BLOCK: 'blockCustomer',
  CHANGE_PASSWORD: 'changePassword',
};

interface IModalContainerProps {
  customersDataIm: TCustomerState;
  modalComponentIm: TModalState;
  customersDataUpdateSignal: typeof customersActions.customersDataUpdateSignal;
  dispatch: Dispatch<any>;
}
// Call modalContainerEnhance for passing modalComponentIm into the component
const CustomersModalContainer = modalContainerEnhance(
  class extends PureComponent<IModalContainerProps> {
    render() {
      const {
        customersDataIm,
        modalComponentIm,
        customersDataUpdateSignal,
        dispatch,
      } = this.props;

      return (
        <Fragment>
          <Modal modalId={modalId.ADD}>
            <ModalAddCustomer />
          </Modal>

          <Modal modalId={modalId.EDIT}>
            <ModalEditCustomer
              getCustomer={() => {
                if (!modalComponentIm.options) {
                  return undefined;
                }

                const customerId = modalComponentIm.options.id;

                return customersDataIm.data.find(model => model.get('id') === customerId);
              }}
            />
          </Modal>

          <Modal modalId={modalId.BLOCK}>
            <ModalBlockCustomer
              getCustomer={() => {
                if (!modalComponentIm.options) {
                  return undefined;
                }

                const customerId = modalComponentIm.options.id;

                return customersDataIm.data.find(model => model.get('id') === customerId);
              }}
            />
          </Modal>

          <Modal modalId={modalId.CHANGE_PASSWORD}>
            <ModalChangePassword
              doneText={() => {
                if (!modalComponentIm.options) {
                  return undefined;
                }

                const customerId = modalComponentIm.options.id;
                const customerIm = customersDataIm.data
                  .find(model => model.get('id') === customerId);

                if (!customerIm) {
                  return undefined;
                }

                return i18next.t('customer_edited', { name: customerIm.get('name') });
              }}
              submitSignal={options => dispatch(customersDataUpdateSignal(options))}
            />
          </Modal>
        </Fragment>
      );
    }
  }
);

interface ICustomersProps {
  customersDataIm: TCustomerState;
  customersDataUpdateSignal: typeof customersActions.customersDataUpdateSignal;
  modalComponentShowSignal: typeof modalActions.modalComponentShowSignal;
}
const Customers: StatelessComponent<ICustomersProps> = ({
  customersDataIm,
  customersDataUpdateSignal,
  modalComponentShowSignal,
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
        onClick: item => modalComponentShowSignal(modalId.EDIT, { id: item.get('id') }),
      },
      {
        getIcon: () => 'account_circle',
        getTitle: () => i18next.t('change_password'),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowSignal(modalId.CHANGE_PASSWORD, { id: item.get('id') }),
      },
      {
        getIcon: item => (item.get('active') ? 'enhanced_encryption' : 'no_encryption'),
        getTitle: item => i18next.t(item.get('active') ? 'block' : 'unblock'),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowSignal(modalId.BLOCK, { id: item.get('id') }),
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
          items={customersDataIm.data}
          cells={cells}
          row={row}
          filterFields={filterFields}
          showHeader
          createButton={{
            onClick: () => modalComponentShowSignal(modalId.ADD, false),
          }}
        />

        <CustomersModalContainer
          customersDataIm={customersDataIm}
          customersDataUpdateSignal={customersDataUpdateSignal}
        />
      </div>
    </div>
  );
};

const CustomersWithFetch = dataFetcherEnhance(Customers);

export default connect(mapStateToProps, mapDispatchToProps)(CustomersWithFetch);
