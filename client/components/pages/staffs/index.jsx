import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { Table } from 'containers';
import { roles } from 'shared/constants';
import dataFetcherEnhance from 'components/data-fetcher-enhance';
import { sortType, filterType } from 'client-constants.ts';
import { actions as staffsDataActions } from 'ducks/data/staffs';
import { actions as modalComponentActions } from 'ducks/components/modal';
import Modal, { ModalChangePassword, modalContainerEnhance } from 'components/modal';
import ModalAddStaff from './modal-add-staff';
import ModalEditStaff from './modal-edit-staff';
import ModalBlockStaff from './modal-block-staff';

const mapDispatchToProps = Object.assign(
  {},
  staffsDataActions,
  modalComponentActions
);

const mapStateToProps = state => ({
  staffsDataIm: state.data.staffsDataIm,
  fetchActionAttributes: [{ name: 'staffsDataGetSignal' }],
});

const modalId = {
  ADD: 'addStaff',
  EDIT: 'editStaff',
  BLOCK: 'blockStaff',
  CHANGE_PASSWORD: 'changePassword',
};

// Call modalContainerEnhance for passing modalComponentIm into the component
const StaffsModalContainer = modalContainerEnhance(
  class extends PureComponent {
    render() {
      const {
        staffsDataIm,
        modalComponentIm,
        staffsDataAddSignal,
        staffsDataUpdateSignal,
      } = this.props;

      return (
        <Fragment>
          <Modal modalId={modalId.ADD}>
            <ModalAddStaff submitSignal={staffsDataAddSignal} />
          </Modal>

          <Modal modalId={modalId.EDIT}>
            <ModalEditStaff
              getStaff={() => {
                const staffId = modalComponentIm.get('options').id;

                return staffsDataIm.get('data').find(model => model.get('id') === staffId);
              }}
              submitSignal={staffsDataUpdateSignal}
            />
          </Modal>

          <Modal modalId={modalId.BLOCK}>
            <ModalBlockStaff
              getStaff={() => {
                const staffId = modalComponentIm.get('options').id;

                return staffsDataIm.get('data').find(model => model.get('id') === staffId);
              }}
              submitSignal={staffsDataUpdateSignal}
            />
          </Modal>

          <Modal modalId={modalId.CHANGE_PASSWORD}>
            <ModalChangePassword
              doneText={() => {
                const staffId = modalComponentIm.get('options').id;
                const staffIm = staffsDataIm.get('data').find(model => model.get('id') === staffId);

                return i18next.t('staff_edited', { name: staffIm.get('name') });
              }}
              submitSignal={staffsDataUpdateSignal}
            />
          </Modal>
        </Fragment>
      );
    }
  }
);

const Staffs = ({
  staffsDataIm,
  staffsDataAddSignal,
  staffsDataUpdateSignal,
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
      id: 'role',
      getValue: model => i18next.t(model.get('role')),
      className: 'table__cell_3',
      name: i18next.t('role'),
      sort: {
        type: sortType.ALPHABETIC,
        field: 'role',
      },
    },
    {
      id: 'email',
      getValue: model => model.get('email'),
      name: i18next.t('email'),
      className: 'table__cell_4',
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
        isShown: item => item.get('role') !== roles.ADMIN,
        getIcon: item => (item.get('active') ? 'enhanced_encryption' : 'no_encryption'),
        getTitle: item => i18next.t(item.get('active') ? 'block' : 'unblock'),
        getClassName: () => 'button_flat button_icon',
        onClick: item => modalComponentShowSignal(modalId.BLOCK, { id: item.get('id') }),
      },
    ],
  };

  // Describe filters
  const rolesForFilter = [
    { name: i18next.t(roles.ADMIN), value: roles.ADMIN },
    { name: i18next.t(roles.ENGINEER), value: roles.ENGINEER },
  ];

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
    {
      type: filterType.SELECT,
      key: 'role',
      name: i18next.t('role'),
      options: rolesForFilter,
    },
  ];

  return (
    <div className="content">
      <div className="content__body">
        <Table
          items={staffsDataIm.get('data')}
          cells={cells}
          row={row}
          filterFields={filterFields}
          showHeader
          createButton={{
            onClick: () => modalComponentShowSignal(modalId.ADD, false),
          }}
        />

        <StaffsModalContainer
          staffsDataIm={staffsDataIm}
          staffsDataAddSignal={staffsDataAddSignal}
          staffsDataUpdateSignal={staffsDataUpdateSignal}
        />
      </div>
    </div>
  );
};

const StaffsWithFetch = dataFetcherEnhance(Staffs);

export default connect(mapStateToProps, mapDispatchToProps)(StaffsWithFetch);
